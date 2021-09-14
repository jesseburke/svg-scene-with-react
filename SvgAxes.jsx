import React, { useState, useRef, useEffect, useContext } from 'react';
import { atom, useAtom } from 'jotai';

import { round } from '@jesseburke/basic-utils';

import { SvgContext } from './SvgScene';

const originRadius = 5;
const axesWidth = 2;

export default function SvgAxes({}) {
    const { mathBoundsAtom, svgBoundsAtom, zoomAtom, mathToSvgFuncAtom, graphSqWAtom } = useContext(
        SvgContext
    );

    const { xMin: xMinMath, xMax: xMaxMath, yMin: yMinMath, yMax: yMaxMath } = useAtom(
        mathBoundsAtom
    )[0];

    const { xMin: xMinSvg, xMax: xMaxSvg, yMin: yMinSvg, yMax: yMaxSvg } = useAtom(
        svgBoundsAtom
    )[0];

    const mathToSvgFunc = useAtom(mathToSvgFuncAtom)[0].func;

    const zoom = useAtom(zoomAtom)[0];

    const { x: xcSvg, y: ycSvg } = mathToSvgFunc({ x: 0, y: 0 });

    const graphSqW = useAtom(graphSqWAtom)[0];

    const [lineArray, setLineArray] = useState();

    useEffect(() => {
        const firstX = graphSqW * Math.ceil(xMinMath / graphSqW);
        const firstY = graphSqW * Math.ceil(yMinMath / graphSqW);

        let ptArray = [];

        for (let i = 0; i <= Math.floor((xMaxMath - xMinMath) / graphSqW); i++) {
            ptArray.push([
                mathToSvgFunc({ x: firstX + i * graphSqW, y: yMinMath }),
                mathToSvgFunc({ x: firstX + i * graphSqW, y: yMaxMath })
            ]);
        }

        for (let i = 0; i <= Math.floor((yMaxMath - yMinMath) / graphSqW); i++) {
            ptArray.push([
                mathToSvgFunc({ y: firstY + i * graphSqW, x: xMinMath }),
                mathToSvgFunc({ y: firstY + i * graphSqW, x: xMaxMath })
            ]);
        }

        setLineArray(
            ptArray.map(([{ x: x1, y: y1 }, { x: x2, y: y2 }], i) => (
                <line
                    x1={`${x1}`}
                    y1={`${y1}`}
                    x2={`${x2}`}
                    y2={`${y2}`}
                    key={`${x1}${x2}${y1}${y2}`}
                    stroke='lightgray'
                    strokeWidth={`${1 / zoom}`}
                />
            ))
        );
    }, [mathToSvgFunc, graphSqW, xMinSvg, xMaxSvg, yMinSvg, yMaxSvg]);

    let xOnScreen = false;

    if (xMinSvg <= xcSvg && xcSvg <= xMaxSvg) {
        xOnScreen = true;
    }

    let yOnScreen = false;

    if (yMinSvg <= ycSvg && ycSvg <= yMaxSvg) {
        yOnScreen = true;
    }

    return (
        <g>
            <g>{lineArray}</g>
            {xOnScreen ? (
                <line
                    x1={xcSvg}
                    y1={yMinSvg}
                    x2={xcSvg}
                    y2={yMaxSvg}
                    stroke='black'
                    strokeWidth={axesWidth / zoom}
                />
            ) : null}
            {yOnScreen ? (
                <line
                    y1={ycSvg}
                    x1={xMinSvg}
                    y2={ycSvg}
                    x2={xMaxSvg}
                    stroke='black'
                    strokeWidth={axesWidth / zoom}
                />
            ) : null}
            {xOnScreen && yOnScreen ? (
                <circle
                    cx={0}
                    cy={0}
                    r={originRadius}
                    stroke='red'
                    fill='red'
                    transform={`translate(${mathToSvgFunc({ x: 0, y: 0 }).x} ${
                        mathToSvgFunc({ x: 0, y: 0 }).y
                    }) scale(${1 / zoom})`}
                />
            ) : null}
        </g>
    );
}
