import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { atom, useAtom } from 'jotai';
import * as Tooltip from '@radix-ui/react-tooltip';

import { SvgContext } from '../SvgScene';

const left = 0;
const size = 30;
const margin = 8;
const radius = 6;

const toolNumber = 4;

export default function SvgZoomBar({
    zoomAtom,
    heightAndWidthAtom,
    modeAtom,
    svgBoundsAtom,
    upperLeftPointAtom,
    zoomAtMax,
    zoomAtMin
}) {
    const [zoom, zoomReducer] = useAtom(zoomAtom);
    const { height, width } = useAtom(heightAndWidthAtom)[0];

    const { xMin, xMax, yMin, yMax } = useAtom(svgBoundsAtom)[0];

    const toolBarHeight = margin + (size + margin) * toolNumber + margin;

    const top = height - toolBarHeight - 2 * margin;

    const [mode, setMode] = useAtom(modeAtom);

    const setUL = useAtom(upperLeftPointAtom)[1];

    const centerCB = useCallback(() => {
        setMode('center');
    }, []);

    return (
        <g
            id='toolbar'
            onMouseDown={(e) => {
                e.stopPropagation();
            }}
            onTouchStart={(e) => {
                e.stopPropagation();
            }}
            transform={`translate(${xMin + 10 / zoom} ${yMin + 10 / zoom}) scale(${1 / zoom})`}
        >
            <rect
                x={left + margin}
                y={top}
                rx={radius}
                ry={radius}
                width={size + margin * 2}
                height={margin + (size + margin) * toolNumber}
                fill='#ddd'
                opacity='0.8'
            />
            <rect
                x={left + 2 * margin}
                y={top + margin}
                rx={radius}
                ry={radius}
                width={size}
                height={size}
                onClick={() => zoomReducer('zoom in button')}
                fill='#aaa'
                opacity={zoomAtMax ? '0.1' : '0.8'}
            >
                <title>Zoom in</title>
            </rect>
            <text
                x={left + 2 * margin + size / 2}
                y={top + margin + size / 2}
                fill='none'
                stroke='#333'
                textAnchor='middle'
                dominantBaseline='central'
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                fontSize={size * 0.7}
                opacity={zoomAtMax ? '0.1' : '0.8'}
            >
                {'\u002B'}
            </text>
            <rect
                x={left + 2 * margin}
                y={top + margin + size + margin}
                rx={radius}
                ry={radius}
                width={size}
                height={size}
                onClick={() => zoomReducer('zoom out button')}
                fill='#aaa'
                opacity={zoomAtMin ? '0.1' : '0.8'}
            >
                {' '}
                <title>Zoom out</title>
            </rect>
            <text
                x={left + 2 * margin + size / 2}
                y={top + margin + size / 2 + size + margin}
                fill='none'
                stroke='#333'
                textAnchor='middle'
                dominantBaseline='central'
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                fontSize={size * 0.7}
                opacity={zoomAtMin ? '0.1' : '0.8'}
            >
                {'\u2212'}
            </text>
            <rect
                x={left + 2 * margin}
                y={top + margin + 2 * (size + margin)}
                rx={radius}
                ry={radius}
                width={size}
                height={size}
                onClick={() => {
                    zoomReducer('reset');
                    setUL({ x: 0, y: 0 });
                    setMode('pan');
                }}
                fill='#aaa'
                opacity='0.8'
            >
                {' '}
                <title>Reset view</title>
            </rect>
            <text
                x={left + 2 * margin + size / 2}
                y={top + margin + size / 2 + 2 * (size + margin)}
                fill='none'
                stroke='#333'
                textAnchor='middle'
                dominantBaseline='central'
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                fontSize={size * 0.7}
            >
                {'\u21ba'}
            </text>
            <rect
                x={left + 2 * margin}
                y={top + margin + 3 * (size + margin)}
                rx={radius}
                ry={radius}
                width={size}
                height={size}
                onClick={centerCB}
                fill='#aaa'
                opacity='0.8'
            >
                {' '}
                <title>Choose view center</title>
            </rect>
            <text
                x={left + 2 * margin + size / 2}
                y={top + margin + size / 2 + 3 * (size + margin)}
                fill='none'
                stroke='#333'
                textAnchor='middle'
                dominantBaseline='central'
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                fontSize={size * 0.7}
            >
                {'c'}
            </text>
        </g>
    );
}

{
    /* <text
    x={left + margin}
    y={top + margin}
    fill='none'
    stroke='#333'
    textAnchor='middle'
    dominantBaseline='central'
    style={{ userSelect: 'none', pointerEvents: 'none' }}
    fontFamily='Material Icons'
    fontSize={size * 0.7}
    >
    'abc' //{'&#xe8ff;'}
    </text> */
}
