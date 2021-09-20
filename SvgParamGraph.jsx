import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { atom, useAtom } from 'jotai';
import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js';

import { ParamGraphPts2D } from '@jesseburke/math-utils';
import { SvgContext } from './SvgScene';

export default function SvgParamGraph({
    displayPoints = false,
    curveDataAtom,
    xFuncAtom,
    yFuncAtom
}) {
    const { mathBoundsAtom, mathToSvgFuncAtom, zoomAtom } = useContext(SvgContext);

    const bounds = useAtom(mathBoundsAtom)[0];

    const zoom = useAtom(zoomAtom)[0];

    const mathToSvgFunc = useAtom(mathToSvgFuncAtom)[0].func;

    const xFunc = useAtom(xFuncAtom)[0].func;
    const yFunc = useAtom(yFuncAtom)[0].func;

    const { approxH, color, width } = useAtom(curveDataAtom)[0];

    const [curveSvg, setCurveSvg] = useState(null);

    useEffect(() => {
        let ptArray = ParamGraphPts2D({
            xFunc,
            yFunc,
            tBounds: { tMin: -10, tMax: 10 },
            approxH: approxH / zoom
        });

        ptArray = ptArray.length > 2 ? curveToBezier(ptArray) : ptArray;

        setCurveSvg(mathCurveToSvgCurve(ptArray, mathToSvgFunc, width / zoom, color));
    }, [xFunc, yFunc, color, width, mathToSvgFunc]);

    return (
        <g key={`${xFuncAtom}`}>
            <g>{curveSvg}</g>
        </g>
    );
}

// ptArray is an array of [number, number], and
// coordFunc takes the point coords to svg coords.
// the function returns an svg path component

function mathCurveToSvgCurve(ptArray, coordFunc, curveWidth, color) {
    if (ptArray.length == 2) {
        const { x: x1, y: y1 } = coordFunc({ x: ptArray[0][0], y: ptArray[0][1] });
        const { x: x2, y: y2 } = coordFunc({ x: ptArray[1][0], y: ptArray[1][1] });

        return (
            <line
                x1={`${x1}`}
                x2={`${x2}`}
                y1={`${y1}`}
                y2={`${y2}`}
                fill='none'
                stroke={`${color}`}
                strokeWidth={`${curveWidth}`}
                key={`l${ptArray[0][0]},${ptArray[0][1]}`}
            />
        );
    }

    const newPtArray = ptArray.map(([x, y]) => [coordFunc({ x, y }).x, coordFunc({ x, y }).y]);

    let d = `M${newPtArray[0][0]} ${newPtArray[0][1]}`;
    let i = 1;
    while (i + 2 < newPtArray.length) {
        d += ` C${newPtArray[i][0]} ${newPtArray[i][1]},`;
        d += `${newPtArray[i + 1][0]} ${newPtArray[i + 1][1]},`;
        d += `${newPtArray[i + 2][0]} ${newPtArray[i + 2][1]}`;
        i += 3;
    }

    return (
        <path
            d={d}
            fill='none'
            stroke={`${color}`}
            strokeWidth={`${curveWidth}`}
            key={`c${ptArray}`}
        />
    );
}
