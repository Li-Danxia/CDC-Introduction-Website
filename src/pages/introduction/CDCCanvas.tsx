import { FC, ReactElement, useCallback, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import useState from 'react-usestateref';
import { Button, Select, Slider, Space, Col, Row } from 'antd'
import { CDC_Cluster } from './CDC';
import { DS1, DS2, DS3, DS4 } from '../../assets/data/CDCSampleData';

const CDCCanvas: FC = (): ReactElement => {
    const [dataset, setDataset, datasetRef] = useState('DS1')
    const [K, setK, KRef] = useState(15)
    const [Ratio, setRatio, RatioRef] = useState(0.6)
    const [result, setResult] = useState(() => { return CDC_Cluster(DS1, K, Ratio) })
    const [currentIndex, setCurrentIndex, currentIndexRef] = useState(0)
    const [kDisabled, setKDisabled] = useState(false)
    const [ratioDisabled, setRatioDisabled] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [legend1, setLegend1] = useState('block')
    const [legend2, setLegend2] = useState('none')
    const [legend3, setLegend3] = useState('none')
    const [maxK, setMaxK] = useState(40)

    const getResult = () => {
        var points = []
        if (datasetRef.current === 'DS1') {
            points = DS1
        } else if (datasetRef.current === 'DS2') {
            points = DS2
        } else if (datasetRef.current === 'DS3') {
            points = DS3
        } else {
            points = DS4
        }
        return CDC_Cluster(points, KRef.current, RatioRef.current)
    }

    var resultData = result[0]
    var knns = result[1]
    var closestDis = result[2]
    // console.log(resultData, knns, closestDis)
    var colors = ['#bbb', '#37A2DA', '#37a354', '#FF8C00', '#9932CC', '#D1B10E', '#C71585', '#20B2AA', '#DC143C', '#B0C4DE', '#FF0000', '#FF00FF', '#DB7093', '#F7DC50', '#DA70D6', '#40E0D0', '#FA8072', '#00FA9A', '#CD853F'];
    var CLUSTER_COUNT = resultData[resultData.length - 1][4];

    const DCMRange = () => {
        var minDCM = resultData[0][2]
        var maxDCM = resultData[0][2]
        for (var i = 0; i < resultData.length; i++) {
            if (resultData[i][2] <= minDCM) {
                minDCM = resultData[i][2]
            }
            if (resultData[i][2] >= maxDCM) {
                maxDCM = resultData[i][2]
            }
        }
        return [minDCM, maxDCM]
    }
    const minDCM = DCMRange()[0]
    const maxDCM = DCMRange()[1]
    // console.log(minDCM, maxDCM)

    const internalPointsColor = () => {
        var color = ['#bbb'];
        for (var i = 1; i <= CLUSTER_COUNT; i++) {
            if (i % 18 != 0) {
                color.push(colors[i % 18])
            } else {
                color.push('#CD853F')
            }
        }
        return color
    };
    const internalColor = internalPointsColor();

    const clustersColor = () => {
        const color = []
        // 可在这里改ratio等于0的情况
        for (var i = 1; i < internalColor.length; i++) {
            color.push(internalColor[i])
        }
        return color
    }
    const finalClustersColor = clustersColor();

    const boundaryData = () => {
        var boundaryData = [];
        for (var i = 0; i < resultData.length; i++) {
            if (resultData[i][3] === 0) {
                boundaryData.push(resultData[i])
            }
        }
        return boundaryData
    }

    function dataLoading(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        // console.log(coord)
        var contentColor = '#bbb';
        return {
            type: 'circle',
            name: 'DCMCalculation',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 5
            },
            style: {
                fill: contentColor,
                stroke: '#333',
                lineWidth: 0.2,
                transition: 'fill',
            }
        };
    }

    function DCMCalculation(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        return {
            // type: 'group',
            // children: [{
            type: 'circle',
            name: 'DCMCalculation',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 5
            },
            style: {
                fill: api.visual('color'),
                stroke: '#333',
                lineWidth: 0.2,
                transition: 'fill'
            }
        }
    }

    function boundaryPointsColor(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        return {
            type: 'circle',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 5
            },
            style: {
                fill: api.visual('color'),
                stroke: '#333',
                lineWidth: 0.2,
                transition: ['stroke', 'fill']
            }
        }
    }

    function boundaryPointsIdentification(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        return {
            type: 'circle',
            name: 'boundaryPointsIdentification',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 6
            },
            style: {
                fill: null,
                stroke: 'rgb(23,142,254)', //#91d5ff
                lineWidth: 2,
                // shadowBlur: 1.5,
                // shadowColor: 'rgba(135,206,235,0.3)',
                transition: ['stroke', 'fill'],
            }
        };
    }

    function connection(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        return {
            type: 'circle',
            name: 'connection',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 5
            },
            style: {
                fill: api.visual('color'),
                stroke: '#333',
                lineWidth: 0.2,
                transition: 'fill'
            }
        }
    }

    // const reachableRange = useCallback((params: any, api: any) => {
    //     var coord = api.coord([api.value(0), api.value(1)])
    //     var size = api.size([api.value(2), api.value(3)])
    //     console.log(coord)
    //     return {
    //         type: 'circle',
    //         name: 'reachableRange',
    //         x: coord[0],
    //         y: coord[1],
    //         shape: {
    //             cx: 0,
    //             cy: 0,
    //             r: (Math.sqrt(Math.pow(size[0], 2) + Math.pow(size[1], 2)))
    //         },
    //         style: {
    //             fill: null,
    //             stroke: '#333',
    //             lineWidth: 1,
    //             lineDash: [4, 2],
    //             transition: 'stroke'
    //         }
    //     }
    // }, [])

    function reachableRange(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)])
        var size = api.size([api.value(2), api.value(3)])
        // console.log(coord)
        return {
            type: 'circle',
            name: 'reachableRange',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: (Math.sqrt(Math.pow(size[0], 2) + Math.pow(size[1], 2)))
            },
            style: {
                fill: 'rgba(240, 242, 245, 0.4)',
                stroke: '#104E8B',
                lineWidth: 0.8,
                lineDash: [4, 2],
                transition: 'stroke'
            }
        }
    }

    function clustersGeneration(params: any, api: any) {
        var coord = api.coord([api.value(0), api.value(1)]);
        return {
            type: 'circle',
            name: 'clustersGeneration',
            x: coord[0],
            y: coord[1],
            shape: {
                cx: 0,
                cy: 0,
                r: 5
            },
            style: {
                fill: api.visual('color'),
                stroke: '#333',
                lineWidth: 0.2,
                transition: 'fill'
            }
        }
    }

    const knnLinks = (dataIndex: number) => {
        var knnLinks = [];
        for (var i = 0; i < K; i++) {
            knnLinks.push({
                source: dataIndex,
                target: knns[dataIndex][i].id
            })
        }
        return knnLinks
    }

    const closestDistance = (externalPointIndex: number, closestPointIndex: number) => {
        var closestDistance = [
            {
                source: externalPointIndex,
                target: closestPointIndex
            }
        ]
        return closestDistance
    }

    const reachableDistance = (centerIndex: number, boundaryPointIndex: number) => {
        var reachableDistance = [
            {
                source: centerIndex,
                target: boundaryPointIndex
            }
        ]
        return reachableDistance
    }

    const option = {
        timeline: {
            top: 30,
            right: 120,
            height: 370,
            width: 10,
            inverse: true,
            orient: 'vertical',
            loop: false,
            currentIndex: 0,
            replaceMerge: ['series', 'visualMap'],
            autoPlay: false,
            playInterval: 2000,
            symbol: 'none',
            axisType: 'category',
            label: {
                position: 11,
                width: 120,
                overflow: 'break',
                fontSize: 14
            },
            progress: {
                label: {
                    fontSize: 14,
                    color: 'rgba(0, 0, 0, 0.85)'
                }
            },
            emphasis: {
                label: {
                    fontSize: 14,
                    color: 'rgba(0, 0, 0, 0.85)'
                }
            },
            checkpointStyle: {
                animationDuration: true,
            },
            data: ['Data loading', 'DCM calculation', 'Boundary points identification', 'Internal points connection', 'Clusters generation']
        },
        baseOption: {
            animation: false,
            dataset: [
                {
                    source: resultData
                }],
            xAxis: {
                show: false,
                splitLine: {
                    show: false
                },
                scale: true
            },
            yAxis: {
                show: false,
                splitLine: {
                    show: false
                },
                scale: true
            },
            toolbox: {
                right: 150,
                top: 0,
                feature: {
                    dataZoom: {
                        show: false,
                    },
                    // restore: {
                    //     title: 'Zoom to Fit',
                    //     icon: 'image://https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-1/128/fullscreen-512.png',
                    //     emphasis: {
                    //         iconStyle: {
                    //             textPosition: 'right',
                    //             textFill: 'black'
                    //         }
                    //     }
                    // },
                    myTool1: {
                        show: true,
                        title: 'Zoom to Fit',
                        icon: 'image://https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-1/128/fullscreen-512.png',
                        emphasis: {
                            iconStyle: {
                                textPosition: 'right',
                                textFill: 'black'
                            }
                        },
                        onclick: function () { }
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                },
                {
                    type: 'inside',
                    orient: 'vertical',
                }
            ],
            grid: {
                top: 40,
                bottom: 82,
                left: 70,
                right: 190,
            },
            series: [
                {
                    type: 'scatter'
                }
            ],
        },
        options: [
            {
                series: [
                    {
                        type: 'custom',
                        name: 'dataLoading',
                        encode: {
                            tooltip: [0, 1]
                        },
                        transition: 'all',
                        renderItem: dataLoading,
                    },
                ]
            },
            {
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 1,
                    range: [minDCM, maxDCM],
                    text: ['1', '0'],
                    calculable: true,
                    orient: 'vertical',
                    left: 0,
                    top: 145,
                    dimension: 2,
                    itemWidth: 10,
                    itemHeight: 100,
                    precision: 3,
                    inRange: {
                        color: ['yellow', 'orange', 'red'],
                    },
                },
                series: [{
                    type: 'custom',
                    name: 'DCMCalculation',
                    encode: {
                        tooltip: [0, 1]
                    },
                    transition: 'all',
                    renderItem: DCMCalculation,
                }]
            },
            {
                visualMap: {
                    type: 'continuous',
                    min: 0,
                    max: 1,
                    range: [minDCM, maxDCM],
                    text: ['1', '0'],
                    calculable: true,
                    orient: 'vertical',
                    left: 0,
                    top: 145,
                    dimension: 2,
                    itemWidth: 10,
                    itemHeight: 100,
                    precision: 3,
                    inRange: {
                        color: ['yellow', 'orange', 'red'],
                    },
                },
                series: [
                    {
                        type: 'custom',
                        encode: {
                            tooltip: [0, 1]
                        },
                        // transition: 'all',
                        renderItem: boundaryPointsIdentification,
                        data: boundaryData(),
                        silent: true
                    },
                    {
                        type: 'custom',
                        encode: {
                            tooltip: [0, 1]
                        },
                        // transition: 'all',
                        renderItem: boundaryPointsColor,
                    },
                ]
            },
            {
                visualMap: {
                    show: false,
                    type: 'continuous',
                    min: 0,
                    max: CLUSTER_COUNT,
                    calculable: true,
                    dimension: 3,
                    inRange: {
                        color: internalColor,
                    }
                },
                series: [
                    {
                        type: 'custom',
                        name: 'connection',
                        encode: {
                            tooltip: [0, 1]
                        },
                        transition: 'all',
                        renderItem: connection,
                    }
                ]
            },
            {
                visualMap: {
                    show: false,
                    type: 'continuous',
                    min: 1,
                    max: CLUSTER_COUNT,
                    calculable: true,
                    dimension: 4,
                    inRange: {
                        color: finalClustersColor,
                    }
                },
                series: [
                    {
                        type: 'custom',
                        name: 'clustersGeneration',
                        encode: {
                            tooltip: [0, 1]
                        },
                        transition: 'all',
                        renderItem: clustersGeneration,
                    }
                ]
            }
        ]
    };

    const chartRef: any = useRef(null)
    const boxRef: any = useRef(null)
    var chartInstance: any = null;

    const renderChart = () => {
        try {
            const CDCCanvasBox = boxRef.current
            CDCCanvasBox.oncontextmenu = function () { return false; };

            const renderedInstance = echarts.getInstanceByDom(chartRef.current);
            if (renderedInstance) {
                chartInstance = renderedInstance;
            } else {
                chartInstance = echarts.init(chartRef.current, { useDirtyRect: true });
            }
            option.timeline.currentIndex = currentIndexRef.current
            chartInstance.setOption(option, true);
            // chartInstance.dispatchAction({
            //     type: 'timelineChange',
            //     currentIndex: currentIndex
            // })

            const rawOption = option
            chartInstance.on('timelinechanged', function (params: any) {
                setCurrentIndex(params.currentIndex)
                chartInstance.setOption(rawOption.options[currentIndexRef.current], { replaceMerge: ['series', 'visualMap'] });
                // console.log(rawOption.options[currentIndex])
                if (currentIndexRef.current === 1) {
                    setKDisabled(false)
                    setRatioDisabled(false)
                    setButtonDisabled(true)
                    setLegend1('block')
                    setLegend2('none')
                    setLegend3('none')
                } else if (currentIndexRef.current === 0) {
                    setKDisabled(false)
                    setRatioDisabled(false)
                    setButtonDisabled(false)
                    setLegend1('block')
                    setLegend2('none')
                    setLegend3('none')
                } else if (currentIndexRef.current === 2) {
                    setKDisabled(true)
                    setRatioDisabled(false)
                    setButtonDisabled(true)
                    setLegend1('none')
                    setLegend2('block')
                    setLegend3('none')
                } else if (currentIndexRef.current === 3) {
                    setKDisabled(true)
                    setRatioDisabled(true)
                    setButtonDisabled(true)
                    setLegend1('none')
                    setLegend2('none')
                    setLegend3('block')
                } else {
                    setKDisabled(true)
                    setRatioDisabled(true)
                    setButtonDisabled(true)
                    setLegend1('none')
                    setLegend2('none')
                    setLegend3('none')
                }
            })

            chartInstance.on('mouseover', { seriesName: 'dataLoading' }, function (params: any) {
                // console.log(params.dataIndex);
                var option = chartInstance.getOption();
                if (params.seriesName === 'dataLoading') {
                    option.series.push({
                        animation: true,
                        animationDuration: 500,
                        type: 'graph',
                        layout: 'none',
                        coordinateSystem: 'cartesian2d',
                        symbolSize: 0,
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [1, 5],
                        data: resultData,
                        links: knnLinks(params.dataIndex),
                        lineStyle: {
                            color: '#333',
                            width: 0.8,
                            opacity: 0.9,
                            type: 'dashed'
                        },
                    });
                    chartInstance.setOption(option, true);
                }

            })

            chartInstance.on('mouseout', { seriesName: 'dataLoading' }, function (params: any) {
                if (params.seriesName === 'dataLoading') {
                    var option = chartInstance.getOption();
                    option.series = option.series[0]
                    chartInstance.setOption(option, true);
                }
            })

            chartInstance.on('mouseover', { seriesName: 'DCMCalculation' }, function (params: any) {
                // console.log(params)
                if (params.seriesName === 'DCMCalculation') {
                    var option = chartInstance.getOption()
                    option.series.push({
                        animation: true,
                        animationDuration: 500,
                        type: 'graph',
                        layout: 'none',
                        coordinateSystem: 'cartesian2d',
                        symbolSize: 0,
                        edgeSymbol: ['circle', 'arrow'],
                        edgeSymbolSize: [1, 5],
                        data: resultData,
                        links: knnLinks(params.dataIndex),
                        lineStyle: {
                            color: '#333',
                            width: 0.8,
                            opacity: 0.9,
                            type: 'dashed'
                        },
                    })
                    chartInstance.setOption(option, true);
                };

            })

            chartInstance.on('mouseout', { seriesName: 'DCMCalculation' }, function (params: any) {
                if (params.seriesName === 'DCMCalculation') {
                    var option = chartInstance.getOption();
                    option.series = option.series[0]
                    chartInstance.setOption(option, true);
                }
            })

            chartInstance.on('click', { seriesName: 'connection' }, function (params: any) {
                // console.log(params)
                // 'mouseover'
                if (params.seriesName === 'connection') {
                    var option = chartInstance.getOption()
                    // console.log(option)
                    // 内部点
                    if (RatioRef.current != 0 && RatioRef.current != 1) {
                        if (params.data[3] !== 0) {
                            var center = [resultData[params.dataIndex][0], resultData[params.dataIndex][1]]
                            var closestExtPoints = [resultData[closestDis[params.dataIndex]][0], resultData[closestDis[params.dataIndex]][1]]
                            // console.log(center, closestExtPoints)
                            option.series.push(
                                {
                                    type: 'custom',
                                    silent: true,
                                    transition: 'all',
                                    data: [[center[0], center[1], Math.abs(center[0] - closestExtPoints[0]), Math.abs(center[1] - closestExtPoints[1])]],
                                    renderItem: reachableRange,
                                },
                                {
                                    type: 'graph',
                                    animation: false,
                                    layout: 'none',
                                    coordinateSystem: 'cartesian2d',
                                    symbolSize: 0,
                                    edgeSymbol: ['circle', 'arrow'],
                                    edgeSymbolSize: [1, 5],
                                    data: resultData,
                                    links: reachableDistance(params.dataIndex, closestDis[params.dataIndex]),
                                    lineStyle: {
                                        color: '#104E8B',
                                        width: 0.8,
                                        opacity: 0.9,
                                        type: 'dashed'
                                    },
                                },
                            )

                        }
                        else {
                            // console.log(params.dataIndex)
                            // 外部点
                            option.series.push(
                                {
                                    type: 'graph',
                                    animation: false,
                                    layout: 'none',
                                    coordinateSystem: 'cartesian2d',
                                    symbolSize: 0,
                                    edgeSymbol: ['circle', 'arrow'],
                                    edgeSymbolSize: [1, 5],
                                    data: resultData,
                                    links: closestDistance(params.dataIndex, closestDis[params.dataIndex]),
                                    lineStyle: {
                                        color: '#006400',
                                        width: 0.8,
                                        opacity: 0.9,
                                        type: 'dashed'
                                    },
                                })
                        }
                        chartInstance.setOption(option, true)
                    }
                };
            })

            chartInstance.getZr().on('contextmenu', function (params: any) {
                // console.log(params);
                if (currentIndexRef.current === 3) {
                    var option = chartInstance.getOption();
                    option.series = option.series[0]
                    chartInstance.setOption(option, true);
                }
            });

            chartInstance.on('mouseover', { seriesName: 'connection' }, function (params: any) {
                if (params.seriesName === 'connection') {
                    var option = chartInstance.getOption()
                    if (RatioRef.current != 0 && RatioRef.current != 1) {
                        if (params.data[3] !== 0) {
                            var center = [resultData[params.dataIndex][0], resultData[params.dataIndex][1]]
                            var closestExtPoints = [resultData[closestDis[params.dataIndex]][0], resultData[closestDis[params.dataIndex]][1]]
                            option.series.push(
                                {
                                    type: 'custom',
                                    silent: true,
                                    transition: 'all',
                                    data: [[center[0], center[1], Math.abs(center[0] - closestExtPoints[0]), Math.abs(center[1] - closestExtPoints[1])]],
                                    renderItem: reachableRange,
                                },
                                {
                                    type: 'graph',
                                    animation: false,
                                    layout: 'none',
                                    coordinateSystem: 'cartesian2d',
                                    symbolSize: 0,
                                    edgeSymbol: ['circle', 'arrow'],
                                    edgeSymbolSize: [1, 5],
                                    data: resultData,
                                    links: reachableDistance(params.dataIndex, closestDis[params.dataIndex]),
                                    lineStyle: {
                                        color: '#104E8B',
                                        width: 0.8,
                                        opacity: 0.9,
                                        type: 'dashed'
                                    },
                                },
                            )

                        }
                        else {
                            option.series.push(
                                {
                                    type: 'graph',
                                    animation: false,
                                    layout: 'none',
                                    coordinateSystem: 'cartesian2d',
                                    symbolSize: 0,
                                    edgeSymbol: ['circle', 'arrow'],
                                    edgeSymbolSize: [1, 5],
                                    data: resultData,
                                    links: closestDistance(params.dataIndex, closestDis[params.dataIndex]),
                                    lineStyle: {
                                        color: '#006400',
                                        width: 0.8,
                                        opacity: 0.9,
                                        type: 'dashed'
                                    },
                                })
                        }
                        chartInstance.setOption(option, true)
                    }
                };
            })

            chartInstance.on('mouseout', { seriesName: 'connection' }, function (params: any) {
                if (params.seriesName === 'connection') {
                    var option = chartInstance.getOption();
                    if (params.data[3] !== 0) {
                        if (option.series.length > 2) {
                            option.series = option.series.slice(0, -2)
                        }
                    } else {
                        if (option.series.length > 1) {
                            option.series = option.series.slice(0, -1)
                        }
                    }
                    chartInstance.setOption(option, true);
                }
            })

            chartInstance.getZr().on('click', function (params: any) {
                // console.log(params)
                if (params.target !== undefined) {
                    if (params.target.style.image === 'https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-1/128/fullscreen-512.png') {
                        chartInstance.dispatchAction({
                            type: 'dataZoom',
                            dataZoomIndex: 0,
                            start: 0,
                            end: 100,
                        })
                        chartInstance.dispatchAction({
                            type: 'dataZoom',
                            dataZoomIndex: 1,
                            start: 0,
                            end: 100,
                        })
                    }
                }
            })
            // chartInstance.on('restore', function () {
            // option.timeline.currentIndex = currentIndexRef.current
            // console.log(option)
            // chartInstance.setOption(option, true);
            // });
        } catch (error: any) {
            console.error("error", error.message);
            chartInstance && chartInstance.dispose();
        }
    }

    useEffect(() => {
        // setTimeout(() => {
        //     renderChart()
        //     console.log('render')
        // }, 20)
        renderChart()
        // console.log('render')
        return () => {
            chartInstance && chartInstance.dispose();
        };
    }, [result]);

    function resizeHandler() {
        chartInstance.resize();
    }

    useEffect(() => {
        window.addEventListener("resize", resizeHandler);
        return () => window.removeEventListener("resize", resizeHandler);
    }, []);

    const onDatasetChange = (value: string) => {
        setDataset(value)
        if (value === 'DS1') {
            setK(15)
            setRatio(0.6)
            setMaxK(40)
        }
        if (value === 'DS2') {
            setK(20)
            setRatio(0.7)
            setMaxK(40)
        }
        if (value === 'DS3') {
            setK(10)
            setRatio(0.5)
            setMaxK(30)
        }
        if (value === 'DS4') {
            setK(10)
            setRatio(0.75)
            setMaxK(30)
        }
        setResult(getResult())
        setCurrentIndex(0)
        setButtonDisabled(false)
        setKDisabled(false)
        setRatioDisabled(false)
        setLegend1('block')
        setLegend2('none')
        setLegend3('none')

    }

    const onKChange = (value: number) => {
        // console.log('onChange: ', value);
        setK(value)
        setResult(getResult())
    }

    const onRatioChange = (value: number) => {
        // console.log('onChange: ', value);
        setRatio(value)
        setResult(getResult())
    }

    const onReset = () => {
        // console.log('onReset');
        if (datasetRef.current === 'DS1') {
            setK(15)
            setRatio(0.6)
        }
        if (datasetRef.current === 'DS2') {
            setK(20)
            setRatio(0.7)
        }
        if (datasetRef.current === 'DS3') {
            setK(10)
            setRatio(0.5)
        }
        if (datasetRef.current === 'DS4') {
            setK(10)
            setRatio(0.75)
        }
        setResult(getResult())
    };

    return (
        <div className='CDC-canvas' ref={boxRef}>
            <div style={{ width: 800, height: 500, margin: '20px auto' }} ref={chartRef}>
            </div>
            <div className='dataset-choice'>
                <span style={{ marginRight: '10px' }}>Dataset</span>
                <Select
                    defaultValue="DS1"
                    style={{ width: 90 }}
                    onChange={onDatasetChange}
                    options={[
                        {
                            value: 'DS1',
                            label: 'DS1',
                        },
                        {
                            value: 'DS2',
                            label: 'DS2',
                        },
                        {
                            value: 'DS3',
                            label: 'DS3',
                        },
                        {
                            value: 'DS4',
                            label: 'DS4',
                        },
                    ]}
                />
            </div>
            <div className='k'>
                <Space>
                    <span style={{ fontWeight: 500 }}>k </span>
                    <Slider disabled={kDisabled} value={K} onChange={onKChange} min={2} max={maxK} tooltip={{ placement: 'right', open: true }} style={{ width: 170 }} />
                </Space>
            </div>
            <div className='ratio'>
                <Space>
                    <span style={{ fontWeight: 500 }}>ratio</span>
                    <Slider disabled={ratioDisabled} value={Ratio} onChange={onRatioChange} step={0.01} min={0.01} max={1} tooltip={{ placement: 'right', open: true }} style={{ width: 170 }} />
                </Space>
            </div>
            <Button className='default-parameters' htmlType="button" disabled={buttonDisabled} onClick={onReset} size='small' style={{ height: 30 }}>
                Default Parameters
            </Button>
            <div className='parameters-box'>
                <p>k={K} <br /> ratio={Ratio}</p>
            </div>
            <div className='legend1' style={{ display: legend1 }}>
                <div><img src={require('../../assets/images/introduction-images/knns.png')} width='40' alt='knns' />knns</div>
            </div>
            <div className='legend2' style={{ display: legend2 }}>
                <div><img src={require('../../assets/images/introduction-images/boundary point.png')} width='15' alt='boundary point' /> boundary point</div>
            </div>
            <div className='legend3' style={{ display: legend3 }}>
                <div>
                    <img src={require('../../assets/images/introduction-images/boundary point1.png')} width='15' alt='boundary point' /> boundary point
                    <img style={{ marginLeft: 27 }} src={require('../../assets/images/introduction-images/reachable distance.png')} width='20' alt='reachable distance' /> reachable range and distance
                    <img style={{ marginLeft: 26 }} src={require('../../assets/images/introduction-images/closest distance.png')} width='37' alt='closest distance' />nearest internal point
                </div>
            </div>

        </div>
    )
}

export default CDCCanvas;

