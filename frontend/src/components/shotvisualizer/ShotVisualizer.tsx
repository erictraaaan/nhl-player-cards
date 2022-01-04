import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IShotVisualizerProps } from './types/ShotVisualizer';

const ShotVisualizer = (props: IShotVisualizerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const RINK_WIDTH = 400
	const RINK_HEIGHT = 168

    useEffect( () => {
        props.events != null && drawRink();
    }, []);

    const drawRink = () => {
		//define the initial SVG element
        let svg = d3.select(ref.current)
            .append("div")
            .classed("svg-container", true) 
            .append('svg')
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", `0 0 ${RINK_WIDTH + 10} ${RINK_HEIGHT + 10}`)
            .classed("svg-content-responsive", true);


        //draw the centre ice line
		drawVerticalLine(svg, 198,0,RINK_HEIGHT,'red');

		//draw centre ice circle
		drawCircle(svg,200,84,30,'red');

        //draw the goals
		drawRectangle(svg,22.6,80,8,12,'blue');
		drawRectangle(svg,371,80,8,12,'blue');

        //draw the goal lines
		drawVerticalLine(svg,22,6,RINK_HEIGHT-12,'red');
		drawVerticalLine(svg,378,6,RINK_HEIGHT-12,'red');

		//draw the blue lines
		drawVerticalLine(svg,144,0,RINK_HEIGHT,'blue');
		drawVerticalLine(svg,252,0,RINK_HEIGHT,'blue');

        //draw the rink outline
		drawBaseRink(svg, RINK_HEIGHT, RINK_WIDTH);

        //plot all goals as points
        plotGoals(svg);

		//create a heatmap for the shots
        plotShotHeatMap(svg);

    }

    const plotGoals = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
        props.events.forEach( (event) => {
            if (event.event == "GOAL"){
                var plotX = 2*event.x + 200;
                var plotY = 2*event.y + 84;
                drawCircle(svg,plotX,plotY,2,'red', 'red');
            }
        })
    }

    const plotShotHeatMap = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
        var heatArrayHome = generateHeatArray(25, 50, 0, 21);

        props.events.forEach( (event) => {
            if (event.event == "SHOT"){
                var plotX = 2*event.x + 200;
                var plotY = 2*event.y + 84;
                addToHeatArray(
					heatArrayHome,{x: plotX, y: plotY});
            }
        })

        let colorScaleHome = generateColourScale('blue');

        drawHeatMap(svg, heatArrayHome,colorScaleHome);

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
            .attr('opacity', .8)
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
			.attr('width', '2')
			.style('fill', colour)
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

    const drawBaseRink = (svg:d3.Selection<SVGSVGElement, unknown, null, undefined>, height: number, width: number) => {
        svg.append("rect")
            .attr('rx', 45)
            .attr('ry', 45)
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style('opacity', 1)
            .style("stroke", 'black')
            .style("fill", "none")
            .style("stroke-width", 'black');
    }


    return (<div className="shot-visualizer-div" ref={ref}/>);
}

export default ShotVisualizer;