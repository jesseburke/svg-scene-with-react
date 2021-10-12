import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    FunctionComponent,
    useContext
} from 'react';
import { atom, useAtom } from 'jotai';

import { round } from '@jesseburke/basic-utils';
import { SvgContext } from '../SvgScene';

export default function SvgBorderAxes() {
    const { mathBoundsAtom, svgBoundsAtom, zoomAtom, mathToSvgFuncAtom } = useContext(SvgContext);

    const { xMin: xMinMath, xMax: xMaxMath, yMin: yMinMath, yMax: yMaxMath } = useAtom(
        mathBoundsAtom
    )[0];

    const { xMin: xMinSvg, xMax: xMaxSvg, yMin: yMinSvg, yMax: yMaxSvg } = useAtom(
        svgBoundsAtom
    )[0];

    const mathToSvgFunc = useAtom(mathToSvgFuncAtom)[0].func;

    const zoom = useAtom(zoomAtom)[0];

    const { x: svgXC, y: svgYC } = mathToSvgFunc({ x: 0, y: 0 });

    return (
        <>
            <text
                style={{ userSelect: 'none', pointerEvents: 'none', background: 'red' }}
                transform={`translate(${(xMaxSvg - xMinSvg) / 2 + xMinSvg} ${yMinSvg}) scale(${
                    1 / zoom
                })`}
                dominantBaseline='hanging'
                textAnchor='middle'
            >
                {`y = ${round(yMaxMath)}`}
            </text>
            <text
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                transform={`translate(${(xMaxSvg - xMinSvg) / 2 + xMinSvg} ${yMaxSvg - 10 / zoom})
        scale(${1 / zoom})`}
                textAnchor='middle'
            >
                {`y = ${round(yMinMath)}`}
            </text>
            <text
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                transform={`translate(${xMaxSvg}
		    ${(yMaxSvg - yMinSvg) / 2 + yMinSvg})  scale(${1 / zoom})`}
                dominantBaseline='middle'
                textAnchor='end'
            >
                {`x = ${round(xMaxMath)}`}
            </text>
            <text
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                transform={`translate(${xMinSvg + 20 / zoom}
		    ${(yMaxSvg - yMinSvg) / 2 + yMinSvg})  scale(${1 / zoom})`}
                dominantBaseline='middle'
                textAnchor='start'
            >
                {`x = ${round(xMinMath)}`}
            </text>
        </>
    );
}
