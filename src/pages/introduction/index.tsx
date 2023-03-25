import React, { FC, ReactElement, useEffect } from "react";
import { Anchor, Layout } from "antd";
import '../../styles/introduction.scss';
import { loadMathJax } from '../../utils/loadMathJax'
import CDCCanvas from "./CDCCanvas";
import { RightOutlined } from "@ant-design/icons";

const Introduction: FC = (): ReactElement => {

    const showMathjax = () => {
        if ((window as any).MathJax) {
            console.log('show MathJax')
        } else {
            setTimeout(showMathjax, 1000)
        }
    }

    useEffect(() => {
        const mathjaxUrl = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML'
        loadMathJax(mathjaxUrl).then(() => {
            showMathjax()
        })
    })

    useEffect(() => {
        if (!(window as any).MathJax) {
            return
        }
        (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub, document.getElementById('root')]);
    })

    return (
        <Layout className="introduction" style={{ padding: '20px 14px', minHeight: 542 }}> {/* heigh: '100%' */}
            <div className="navigation" style={{ position: 'fixed', top: 150 }}>
                <div style={{ backgroundColor: '#F0F2F5', width: 214, height: 40, fontSize: 16, fontWeight: 600, padding: '10px 0 0 5px' }}>NAVIGATION</div>
                <Anchor
                    style={{ width: 215 }}
                    items={[
                        {
                            key: 'interaction',
                            href: '#interaction',
                            title: 'Try and Play',
                        },
                        {
                            key: 'background',
                            href: '#background',
                            title: 'Background',
                        },
                        {
                            key: 'methods',
                            href: '#methods',
                            title: 'Methods',
                            children: [
                                {
                                    key: 'DCM',
                                    href: '#DCM',
                                    // title: <div><RightOutlined style={{ fontSize: 9 }} /> DCM calculation in 2D</div>
                                    title: 'DCM calculation in 2D',
                                },
                                {
                                    key: 'distance',
                                    href: '#distance',
                                    title: 'Reachable distance calculation',
                                },
                                {
                                    key: 'connection',
                                    href: '#connection',
                                    title: 'Internal points connection',
                                },
                                {
                                    key: 'parameter',
                                    href: '#parameter',
                                    title: 'Parameter analysis',
                                },
                                {
                                    key: 'DCM-high-dimensional',
                                    href: '#DCM-high-dimensional',
                                    title: 'DCM in high-dimensional space',
                                },
                            ],
                        },
                    ]}
                />
            </div>

            <div className="introduction-box" id='interaction'>
                <div className="title"><span className="cdc">C</span>lustering by Measuring Local <span className="cdc">D</span>irection <span className="cdc">C</span>entrality (CDC)</div>
                <div>
                    <div style={{ backgroundColor: '#ecf2f5', margin: '30px 0 10px 0', padding: '0 0 0 22px', height: 40, width: 200, borderRadius: 20, borderBottomRightRadius: 20 }}>
                        <h2 style={{ lineHeight: 1.3 }}>Try and Play</h2>
                    </div>
                    <CDCCanvas />
                </div>

                <div>
                    <div id='background' style={{ backgroundColor: '#ecf2f5', margin: '30px 0 10px 0', padding: '0 0 0 22px', height: 40, width: 200, borderRadius: 20, borderBottomRightRadius: 20 }}>
                        <h2 style={{ lineHeight: 1.3 }}>Background</h2>
                    </div>
                    <p>
                        Clustering is a powerful machine learning method for discovering similar patterns according to the proximity of elements in feature space.
                        It aims to find an optimized partition to group independent points to clusters by maximizing the intra-cluster similarity and the inter-cluster difference.
                        However, the heterogeneous density and weak connectivity in data affect the clustering quality significantly. <span className="keyword">Heterogeneous density</span> means that a cluster with uneven density tends to be
                        separated into parts and the sparse clusters are easy to be misidentified as noise, while <span className="keyword">weak connectivity</span> causes nearby clusters difficult to separate.
                        CDC is a boundary-seeking Clustering algorithm using the local Direction Centrality, which is sufficient to tackle abovementioned challenges effectively.
                        CDC adopts a density-independent metric based on the distribution of K-nearest neighbors(KNNs) to distinguish between internal and boundary points.
                        The boundary points generate enclosed cages to bind the connections of internal points, thereby preventing cross-cluster connections and separating weakly-connected clusters.
                    </p>
                    <div className="images-box">
                        <div style={{ width: 300 }}>
                            <img src={require('../../assets/images/introduction-images/heterogeneous density.png')} width="300" alt='Heterogeneous density' />
                            <h5>Heterogeneous density</h5>
                        </div>
                        <div style={{ width: 300 }}>
                            <img src={require('../../assets/images/introduction-images/weak connectivity.png')} width="300" alt='Weak connectivity' />
                            <h5>Weak connectivity</h5>
                        </div>
                    </div>
                </div>

                <div>
                    <div id='methods' style={{ backgroundColor: '#ecf2f5', margin: '30px 0 10px 0', padding: '0 0 0 22px', height: 40, width: 200, borderRadius: 20, borderBottomRightRadius: 20 }}>
                        <h2 style={{ lineHeight: 1.4 }}>Methods</h2>
                    </div>

                    <div id='DCM'>
                        <h3>DCM calculation in 2D</h3>
                        <p>The core idea behind CDC is to distinguish boundary and internal points of clusters based on the distribution of KNNs.
                            The internal points of clusters tend to be surrounded by their neighboring points in all directions, while boundary points only include neighboring points within a certain directional range.
                            To measure such differences in the directional distribution, we define the variance of the angles formed by the KNNs in 2D space as the <span className="keyword">local Direction Centrality Metric (DCM)</span>: </p>
                        <div className="mathjax">`DCM=1/k\sum_(i=1)^k(\alpha_i-(2\pi)/k)^2, where \sum_(i=1)^k\alpha_i=2\pi`</div>
                        <p>KNNs of the center point can form k angles `\alpha_1`, `\alpha_2`…`\alpha_k` (Fig. a) in 2D space. DCM reaches the minimum 0 if and only if all the angles are equal. It can be maximized as `(4(k-1)\pi^2)/k^2` when one of these angles is 2π and the remaining are 0.
                            According to the extrema, DCM can be <span className="keyword">normalized to the range [0, 1]</span> as follows:
                        </p>
                        <div className="mathjax">`DCM=k/(4(k-1)pi^2)\sum_(i=1)^k(\alpha_i-(2\pi)/k)^2`</div>
                        <div style={{ width: 722, margin: '10px auto' }}>
                            <img src={require('../../assets/images/introduction-images/illustration.png')} width="722" alt='Illustration' />
                            <h5>Illustration of algorithm and intermediate results of CDC in 2D space</h5>
                        </div>
                    </div>

                    <div id='distance'>
                        <h3>Reachable distance calculation</h3>
                        <p>A sample result of DCM calculation reveals that the internal points of clusters have relatively low DCMs and the boundary points have higher values (Fig. b). Thus, internal and boundary points can be divided by a threshold `T_(DCM)`.
                            The division results of two synthetic datasets DS5 and DS7 validate the effectiveness (Fig. c, d). To ensure that the internal points `p_1`, `p_2`, …,`p_m` connect to each other within the area restricted by the surrounding boundary points `q_1`, `q_2`, …, `q_(n-m)`,
                            we define the minimum distance between the internal point `p_i` and all boundary points as its <span className="keyword">reachable distance</span>:</p>
                        <div className="mathjax">`r_i=min_(j=1)^(n-m)d(p_i,q_j)`</div>
                        <p>where `d(p_i,q_j)` is the distance between the two points `p_i` and `q_j` (Fig. e).</p>
                    </div>

                    <div id='connection'>
                        <h3>Internal points connection</h3>
                        <p>Two <span className="keyword">internal points can be connected</span> as the same cluster if the following association rule is guaranteed:</p>
                        <div className="mathjax">`d(p_i,p_j)\leqr_i+r_j`</div>
                        <p>where `r_i` and `r_j` are the reachable distances of internal points `p_i` and `p_j`, respectively (Fig. f). If a cross-cluster connection exists between two internal points, there will be boundary points contained in the range defined by their reachable distances,
                            which conflicts with the definition of the reachable distance. Therefore, the internal points of the same cluster can be trapped in the same external contour consisting of boundary points, and the cross-cluster connections will be avoided based on this association rule.
                            The connection results of DS5 and DS7 are generated by applying the rule to the division results (Fig. g, h). The flow animation of CDC algorithm shows as follows: </p>
                        <div style={{ width: 500, margin: '10px auto', textAlign: 'center' }}>
                            <img src={require('../../assets/images/introduction-images/animation.gif')} width="350" alt='Flow animation' />
                            <h5>The flow animation of CDC algorithm</h5>
                        </div>
                    </div>

                    <div id='parameter'>
                        <h3>Parameter analysis</h3>
                        <p>After calculating the DCM and connecting internal points, we finish the procedure by assigning each boundary point to the cluster to which its nearest internal point belongs. CDC contains two controllable parameters, <span className="keyword">k and `T_(DCM)`</span>.
                            k adjusts the number of nearest neighbors, and `T_(DCM)` determines the division of internal and boundary points. In practice, considering `T_(DCM)` varies with data distributions, we adopt a percentile <span className="keyword">`ratio`</span> of internal points to determine `T_(DCM)` as the `[n\cdot(1-ratio)]th`
                            DCM sorted in a descending order. The parameter `ratio` has intuitive physical meaning and better stability, which makes it easier to specify than `T_(DCM)`. According to our experiments, 70%~99% internal points are the suggested default parameter range of `ratio` for promising clustering results.
                            Nevertheless, when clusters are mixed up with each other, more boundary points (lower `ratio`) are necessary to separate the close clusters.</p>
                        <p>The sensitivity analysis for k and `ratio` and existing studies indicate that k is an insensitive parameter and relates to the number of points n in dataset, while `ratio` is a mild sensitive parameter. Thus, we propose an <span className="keyword">empirical method by formulizing the relation between k and n</span> as:</p>
                        <div className="mathjax">`k={'{'}(ceil(n/50)~ceil(n/20),if 100\leqn\leq1000),(ceil(log_2(n)+10)~5ceil(log_2(n)),if n\geq1000):{'}'}`</div>
                        <p>where `ceil(\cdot)` denotes to the nearest integer upwards. This empirical model is represented as a continuous piecewise function that depicts a growth trend of k as n increases. And we propose a method based on <span className="keyword">Triangulated Irregular Network (TIN) and graph theory to estimate the number of boundary points</span>, which can estimate the <span className="keyword">DCM threshold</span>.
                            You can read the <a href="https://www.nature.com/articles/s41467-022-33136-9" target="_blank">paper</a> to know more about how the method works.
                        </p>
                    </div>

                    <div id='DCM-high-dimensional'>
                        <h3>DCM in high-dimensional space</h3>
                        <p>DCM calculation requires to map the KNNs onto the unit hyperspherical surface drawn by their center point firstly, then subdivides the hyperspherical surface and measures the generalized angles of each subdivision unit.
                            In 2D space, KNNs are mapped onto a unit circle. They subdivide the circle into multiple arcs and each arc corresponds to a central angle. DCM measures the variance of these angles. While in 3D space, KNNs are mapped onto a unit spherical surface. They connect neighboring points to form a spherical triangulation and DCM is extended as the variance of the solid angles of the triangles.
                            For subdividing a hyperspherical surface in a higherdimensional space, we adopt <span className="keyword">Qhull</span> algorithm to construct the <span className="keyword">convex complex</span> of KNNs. Since all the KNNs have been mapped onto the hyperspherical surface, they are guaranteed to be the vertices of the convex complex (Repeat KNNs are not included).
                            In d-dimensional space, each facet of the convex complex is a (d-1)-<span className="keyword">simplex</span> and corresponds to a <span className="keyword">subdivision unit</span> (Simplex here denotes the simplest figure that contains d + 1 given points in d-dimensional space and that does not lie in a space of lower dimension).</p>
                        <div style={{ width: 430, margin: '10px auto', textAlign: 'center' }}>
                            <img src={require('../../assets/images/introduction-images/high dimension.png')} width='430' alt='DCM calculation in high-dimensional space' />
                            <h5>DCM calculation in high-dimensional space</h5>
                        </div>
                        <p>After subdividing, the generalized angles could be measured. Natively, the angles are equivalent to volumes of the corresponding subdivision units (e.g., arc length in 2D circle, area of the spherical triangle in 3D sphere). However, it is difficult to calculate the volumes of subdivision units in high-dimensional space due to the computational complexity of multiple integral.
                            Therefore, we <span className="keyword">measure the volume of each simplices</span> and then allocate the global volume error to each subdivision unit evenly for an approximate calculation. Although there are errors between the true and calculated volumes of subdivision units,
                            the DCM sort orders based on the two kinds of volumes are the same, since the volumes of subdivision units increase monotonically with the corresponding simplices. Thus, a DCM threshold can be searched to distinguish the internal and boundary points effectively.</p>
                    </div>
                </div>
                {/* <br /> */}
                <div>Link to original paper: <a href="https://www.nature.com/articles/s41467-022-33136-9" target="_blank">https://www.nature.com/articles/s41467-022-33136-9</a></div>
                <div>GitHub: <a href="https://github.com/zpguigroupwhu" target="_blank">https://github.com/zpguigroupwhu</a></div>
            </div>
        </Layout>
    )
}

export default Introduction;

