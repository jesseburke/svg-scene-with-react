import { atom } from 'jotai';

import { NumberDataComp } from '@jesseburke/jotai-data-setup';
import { PointDataComp } from '@jesseburke/jotai-data-setup';
import { CombineReadWriteAtoms } from '@jesseburke/jotai-data-setup';

import { MatrixFactory } from '@jesseburke/math-utils';

export const defaultZoom1XWidth = 20; // can y width from this and aspect ratio
export const defaultInitXCenter = 0;
export const defaultInitYCenter = 0;
export const defaultZoomFactorButton = 2;
const defaultInitGraphSqW = 1;
const defaultZoomFactorWheel = 1.03;
const defaultZoomMax = 2 ** 15;
const defaultZoomMin = 1 / defaultZoomMax;

export default function SvgData({
    zoom1XWidth = defaultZoom1XWidth,
    initXCenter = defaultInitXCenter,
    initYCenter = defaultInitYCenter,
    initGraphSqW = defaultInitGraphSqW,
    zoomFactorButton = defaultZoomFactorButton,
    zoomFactorWheel = defaultZoomFactorWheel,
    zoomMax = defaultZoomMax,
    zoomMin = defaultZoomMin
} = {}) {
    const svgHeightAndWidthAtom = atom({ height: 0, width: 0 });

    const svgToMathFuncAtom = atom((get) => {
        const { height, width } = get(svgHeightAndWidthAtom);

        const scale = width / zoom1XWidth;

        const m = MatrixFactory([
            [1 / scale, 0, initXCenter - zoom1XWidth / 2],
            [0, -1 / scale, initYCenter + (((1 / 2) * height) / width) * zoom1XWidth],
            [0, 0, 1]
        ]);

        return {
            func: ({ x, y }) => {
                const vec = m.multiplyWithVec([x, y, 1]);
                return { x: vec[0], y: vec[1] };
            }
        };
    });

    const mathToSvgFuncAtom = atom((get) => {
        const { width, height } = get(svgHeightAndWidthAtom);

        const scale = width / zoom1XWidth;

        const m = MatrixFactory([
            [scale, 0, width / 2],
            [0, -scale, height / 2],
            [0, 0, 1]
        ]);

        const func = ({ x, y }) => {
            const vec = m.multiplyWithVec([x, y, 1]);
            return { x: vec[0], y: vec[1] };
        };

        return { func };
    });

    const zoomData = NumberDataComp(1);

    const zoomAtom = atom(
        (get) => get(zoomData.atom),
        (get, set, action) => {
            const z = get(zoomData.atom);

            switch (action) {
                case 'zoom in button':
                    if (z < zoomMax) {
                        set(zoomData.atom, z * zoomFactorButton);
                    }
                    break;

                case 'zoom in wheel':
                    if (z < zoomMax) {
                        set(zoomData.atom, z * zoomFactorWheel);
                    }
                    break;

                case 'zoom out button':
                    if (z > zoomMin) {
                        set(zoomData.atom, z / zoomFactorButton);
                    }
                    break;

                case 'zoom out wheel':
                    if (z > zoomMin) {
                        set(zoomData.atom, z / zoomFactorWheel);
                    }
                    break;

                case 'reset':
                    set(zoomData.atom, 1);
                    break;
            }
        }
    );

    const zoomAtMaxAtom = atom((get) => get(zoomAtom) >= zoomMax);
    const zoomAtMinAtom = atom((get) => get(zoomAtom) <= zoomMin);

    const graphSqWAtom = atom((get) => initGraphSqW / get(zoomAtom));

    const upperLeftPointData = PointDataComp({ x: 0, y: 0 });

    const svgSaveDataAtom = CombineReadWriteAtoms({
        zm: zoomData.readWriteAtom,
        ulp: upperLeftPointData.readWriteAtom
    });

    const svgBoundsAtom = atom((get) => {
        const zoom = get(zoomData.atom);
        const { height, width } = get(svgHeightAndWidthAtom);
        const { x: ulX, y: ulY } = get(upperLeftPointData.atom);

        const svgCenterX = width / 2 + ulX;
        const svgCenterY = height / 2 + ulY;

        return {
            xMin: svgCenterX - width / (2 * zoom),
            xMax: svgCenterX + width / (2 * zoom),
            yMin: svgCenterY - height / (2 * zoom),
            yMax: svgCenterY + height / (2 * zoom)
        };
    });

    const mathBoundsAtom = atom((get) => {
        const svgBds = get(svgBoundsAtom);
        const svgToMathFunc = get(svgToMathFuncAtom).func;

        const { x: xMin, y: yMin } = svgToMathFunc({ x: svgBds.xMin, y: svgBds.yMax });
        const { x: xMax, y: yMax } = svgToMathFunc({ x: svgBds.xMax, y: svgBds.yMin });

        return { xMin, xMax, yMin, yMax };
    });

    const modeAtom = atom('pan');

    return {
        svgHeightAndWidthAtom,
        svgToMathFuncAtom,
        mathToSvgFuncAtom,
        zoomAtom,
        graphSqWAtom,
        upperLeftPointAtom: upperLeftPointData.atom,
        svgBoundsAtom,
        mathBoundsAtom,
        zoomAtMaxAtom,
        zoomAtMinAtom,
        modeAtom,
        svgSaveDataAtom
    };
}
