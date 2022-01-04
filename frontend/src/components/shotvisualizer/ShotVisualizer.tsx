import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IShotVisualizerProps } from './types/ShotVisualizer';
import './ShotVisualizer.scss';

const ShotVisualizer = (props: IShotVisualizerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const RINK_HALF_WIDTH = 100;
    const RINK_HALF_HEIGHT = 85;

    useEffect( () => {
        d3.select('svg').remove();
        props.events != null && drawHalfRink();
    }, [props.events]);

    const drawHalfRink = () => {
        let svg = d3.select(ref.current)
        .append("div")
        .classed("svg-container", true) 
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${RINK_HALF_WIDTH + 10} ${RINK_HALF_HEIGHT + 10}`)
        .classed("svg-content-responsive", true);

        //draw the centre ice line
		drawVerticalLine(svg, 0,0,RINK_HALF_HEIGHT,'red');

        //draw centre ice circle
		drawCircle(svg,0,42.5,15,'red');

        //draw the goal
        drawRectangle(svg,86,39.5,4,6,'blue');

        //draw goal line
		drawVerticalLine(svg,90,1,RINK_HALF_HEIGHT-2,'red');

		//draw the blue line
		drawVerticalLine(svg,30,0,RINK_HALF_HEIGHT,'blue');

        // draw the faceoff circles
        drawCircle(svg, 68,20.5,15,'red')
        drawCircle(svg, 68,64.5,15,'red')

        // draw the faceoff dots
        drawCircle(svg, 68,20.5,1,'red','red')
        drawCircle(svg, 68,64.5,1,'red','red')

        // draw the rink outline
        var rect = svg.append("path")
            .attr("d", rightRoundedRect(0, 0, 100, 85, 15))
            .style("stroke-width", 0.5)
            .attr('stroke', "red")
            .attr('fill', 'transparent');

        // plot the goals
        plotHalfGoals(svg);

        //plot the shot heatmap
        plotHalfShotHeatMap(svg);
    }

    const plotHalfGoals = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
        props.events.forEach( (event) => {
            if (event.event == "GOAL"){
                var plotX = event.x;
                var plotY = 42.5 - event.y;
                drawCircle(svg,plotX,plotY,1,'green', 'green');
            }
        })
    }

    const plotHalfShotHeatMap = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
        var heatArray = generateHeatArray(0, 50, 0, 42);
        props.events.forEach( (event) => {
            if (event.event == "SHOT"){
                var plotX = event.x;
                var plotY = 42.5 - event.y;
                addToHeatArray(
					heatArray,{x: plotX, y: plotY});
            }
        })

        let colorScale = generateColourScale('green');

        drawHeatMap(svg, heatArray,colorScale);
    }

    const drawHeatMap = (svg:any, heatArray: number[][], colourScale: any) => {
		svg.selectAll('rect')
            .data(heatArray)
            .enter()
            .append('rect')
            .attr('rx', 6)
            .attr('ry', 6)
            .attr('x', (d: any) => d[0])
            .attr('y', (d: any)=> d[1] )
            .attr('width', 8)
            .attr('height', 8)
            .attr('fill', (d: any) => colourScale(d[2]))
            .attr('opacity', .6)
	}

    const generateColourScale = (colour: string) => {
		return d3.scaleLinear<string>()
			.domain([0,4])
			.range(['transparent', colour]);
	}

    const addToHeatArray = (array: number[][], coords: {x: number, y: number}) => {
		for (let i = 0 ; i < array.length ; i++) {
			if (coords.x >= array[i][0] && coords.x < (array[i][0]+8)){
				if (coords.y >= array[i][1] && coords.y < (array[i][1]+8)){
					array[i][2]++;
				}
			}
		}
	}

    const generateHeatArray = (startCol: number, endCol: number , startRow: number, endRow: number): number[][] => {
		var output:number[][] = [];
        for (let i = startCol ; i < endCol; i++) {
            for (let j = startRow ; j < endRow; j++) {
                output.push([i*8, j*8, 0]);
            }
        }
		return output;
	}

    const drawVerticalLine = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>,
        x: number, y: number, length: number, colour: string) => {
		svg.append('rect')
			.attr('x', x)
			.attr('y', y)
			.attr('height', length)
			.attr('width', '0.5')
			.style('fill', colour)
    }

    // path for a rectangle that is rounded on two ends. perfect for a half-rink!
    // Taken from StackOverflow : https://stackoverflow.com/questions/12115691/svg-d3-js-rounded-corner-on-one-corner-of-a-rectangle
    const rightRoundedRect = (x: number, y: number,
        width: number, height: number, radius: number) => {
        return "M" + x + "," + y
             + "h" + (width - radius)
             + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
             + "v" + (height - 2 * radius)
             + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
             + "h" + (radius - width)
             + "z";
      }

    const drawCircle =  (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>,
        x: number, y: number, radius: number, colour: string, fill?: string) => {
            svg.append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .style("stroke-width", 0.5)
            .attr('r', radius)
            .attr('stroke', colour)
            .attr('fill', fill ? fill : 'transparent');
    }

    const drawRectangle = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>,
            x: number, y: number, width: number , height: number, colour: string) => {
            svg.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .attr('stroke', colour)
            .style("stroke-width", 0.5)
            .attr('fill', '#89CFF0');
    }
    
    return (<div className="shot-visualizer-div" ref={ref}/>);
}

export default ShotVisualizer;