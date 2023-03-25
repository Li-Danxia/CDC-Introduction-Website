/*目前暂时只写了2D的*/

/*
* @desc Knn算法 (获取特定点KNN，获取KNN矩阵)
* @param  {Object} points 样本集   points=[{"x":1,"y":1},{"x":1,"y":3},{"x":7,"y":8},{"x":1,"y":2},{"x":7,"y":7}];
* @param  {Number} k 用于选择最近邻的数目  
* @return {Array}
*/
interface IPoint {
    x: number;
    y: number
}

function getKNN(current: IPoint, points: IPoint[], k: number) {
    var dists: any = [];//存放最接近的
    points.map(function (item, id) {
        var result: any = {};
        result.id = id;
        result.p = item;
        result.d = GetDistance(current, item);
        dists.push(result);
    });
    dists.sort(function (a: any, b: any) {//排序
        return a.d - b.d;
    });
    dists = dists.slice(1, k + 1);
    return dists;
}

function getKnns(points: IPoint[], k: number) {
    var KNN_Res = [];
    for (var i = 0; i < points.length; i++) {
        var current = points[i];
        var dists = getKNN(current, points, k)
        KNN_Res.push(dists);
    }
    return KNN_Res;
}

/*
* @desc 计算距离
* @param  {Object} 点1
* @param  {Object} 点2
* @return {double} 距离
*/
function GetDistance(p1: IPoint, p2: IPoint) {
    //根据欧几里得距离公式或勾股定理计算距离
    var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    return d;
};

/*
* @desc 计算DCM
* @param  {Array} KNN结果
* @return {Array} DCM结果
*/
interface IKNN_Res {
    id: number;
    p: IPoint;
    d: number
}
function CalDCM(KNN_Res: IKNN_Res[][], points: IPoint[], k_num: number) {
    var DCMs = [];
    for (var i = 0; i < KNN_Res.length; i++) {
        var point = points[i];
        var KNN = KNN_Res[i];
        var angles = [];
        for (var j = 0; j < KNN.length; j++) {
            var item = KNN[j].p;
            var delta_x = item.x - point.x;
            var delta_y = item.y - point.y;
            var angle = 0;
            if (delta_x == 0) {
                if (delta_y == 0)
                    angle = 0;

                else if (delta_y > 0)
                    angle = Math.PI / 2;

                else
                    angle = 3 * Math.PI / 2;
            }

            else if (delta_x > 0) {
                if (Math.atan(delta_y / delta_x) >= 0)
                    angle = Math.atan(delta_y / delta_x);

                else
                    angle = 2 * Math.PI + Math.atan(delta_y / delta_x);
            }

            else {
                angle = Math.PI + Math.atan(delta_y / delta_x);
            }
            angles.push(angle);
        }
        angles = angles.sort();
        var DCM = 0;
        for (var j = 0; j < angles.length - 1; j++) {
            var point_angle = angles[j + 1] - angles[j];
            DCM = DCM + (point_angle - 2 * Math.PI / k_num) ** 2;
        }
        var point_angle = angles[0] - angles[angles.length - 1] + 2 * Math.PI;
        DCM = DCM + (point_angle - 2 * Math.PI / k_num) ** 2;
        DCM = DCM / k_num;
        DCM = DCM / ((k_num - 1) * 4 * Math.PI ** 2 / k_num ** 2);
        DCMs.push(DCM);
    }
    return DCMs;
    //console.log(DCMs);
}

/*
* @desc 内外部点分类
* @param  {Array} DCMs结果
* @param  {float} ratio
* @return {Array} 内外部点结果
*/
function ClassifyInOut(DCMs: number[], ratio: number) {
    var inds = [];
    var t_DCM = [];
    for (var i = 0; i < DCMs.length; i++) {
        t_DCM.push(DCMs[i]);
    }
    t_DCM.sort();
    var DCM_threshold = t_DCM[Math.ceil(DCMs.length * ratio) - 1];
    for (var i = 0; i < DCMs.length; i++) {
        var DCM = DCMs[i];
        if (DCM <= DCM_threshold) {
            inds.push(1);
        }
        else {
            inds.push(0);
        }
    }
    return inds;
}


/*
* @desc 可达距离计算
* @param  {Object} DCMs结果
* @param  {float} ratio
* @param  {Array} 内外部点结果
* @return {Array} 可达距离结果
*/
function CalReachableDis(points: IPoint[], KNN_res: IKNN_Res[][], inds: number[]) {
    var ReachDis = [];
    var closestDis = [];
    for (var i = 0; i < points.length; i++) {
        if (inds[i] == 1) {
            var KNNs = KNN_res[i];
            var flag = 0;
            KNNSearch: for (var j = 0; j < KNNs.length; j++) {
                var id = KNNs[j].id;
                if (inds[id] == 0) {
                    ReachDis.push(KNNs[j].d);
                    closestDis.push(KNNs[j].id)
                    flag = 1;
                    break KNNSearch;
                }
            }
            if (flag == 0) {
                var dis = Infinity;
                var ext_id = 0;
                for (var k = 0; k < points.length; k++) {
                    if (inds[k] == 0) {
                        var distance = GetDistance(points[i], points[k]);
                        if (distance < dis) {
                            dis = distance;
                            ext_id = k;
                        }
                    }
                }
                ReachDis.push(dis);
                closestDis.push(ext_id)
            }

        }
        else {
            KNNs = KNN_res[i];
            var flag = 0;
            KNNSearch: for (var j = 0; j < KNNs.length; j++) {
                var id = KNNs[j].id;
                if (inds[id] == 1) {
                    ReachDis.push(KNNs[j].id);
                    closestDis.push(KNNs[j].id)
                    flag = 1;
                    break KNNSearch;
                }
            }
            if (flag == 0) {
                var dis = Infinity;
                var t_id = 0;
                for (var k = 0; k < points.length; k++) {
                    if (inds[k] == 1) {
                        var distance = GetDistance(points[i], points[k]);
                        if (distance < dis) {
                            dis = distance;
                            t_id = k;
                        }
                    }
                }
                ReachDis.push(t_id);
                closestDis.push(t_id)
            }
        }
    }
    // console.log(closestDis)
    return { ReachDis: ReachDis, closestDis: closestDis };
}


/*
* @desc 内部点连接 包含外部点分配
* @param  {Object} DCMs结果
* @param  {Array} 内外部点结果
* @param  {Array} 可达距离结果
* @return {Array} 点连接结果  
*/
function InternalConnection(points: IPoint[], inds: number[], ReachDis: number[]) {
    var cluster = new Array(points.length).fill(0);
    var mark = 1;
    for (var i = 0; i < points.length; i++) {
        if (inds[i] == 1 && cluster[i] == 0) {
            cluster[i] = mark;
            for (var j = 0; j < points.length; j++) {
                if (i != j && inds[j] == 1 && GetDistance(points[i], points[j]) <= ReachDis[i] + ReachDis[j]) {
                    if (cluster[j] == 0)
                        cluster[j] = cluster[i];
                    else {
                        var temp_cluster = cluster[j];
                        for (var k = 0; k < cluster.length; k++) {
                            if (cluster[k] == temp_cluster) {
                                cluster[k] = cluster[i];
                            }
                        }
                    }
                }
            }
            mark = mark + 1;
        }
    }
    // 前面完成cluster结果为：[], 外部点为0，内部点为1，2，3……
    // console.log(cluster)

    for (var i = 0; i < cluster.length; i++) {
        if (inds[i] == 0) {
            var index = ReachDis[i];
            cluster[i] = cluster[index];
        }
    }
    // console.log(cluster)
    return cluster;
    // 此时cluster结果为：[] 每个点的聚类结果，按顺序排
}


/*
* @desc Adjust the cluster id to continuous positive integer
* @param  {Array} 点连接结果 
* @return {Array} 最终聚类结果  
*/
export function CDC_Cluster(points: IPoint[], k: number, ratio: number) {
    var KNN_Res = getKnns(points, k);
    var DCMs = CalDCM(KNN_Res, points, k);
    var inds = ClassifyInOut(DCMs, ratio);
    var ReachDis = CalReachableDis(points, KNN_Res, inds).ReachDis;
    var closestDis = CalReachableDis(points, KNN_Res, inds).closestDis
    var cluster = InternalConnection(points, inds, ReachDis);
    var mark_temp = 1;
    var storage = new Array(points.length).fill(0);
    for (var i = 0; i < points.length; i++) {
        if (storage.includes(cluster[i])) {
            search: for (var j = 0; j < storage.length; j++) {
                if (storage[j] == cluster[i]) {
                    cluster[i] = cluster[j];
                    break search;
                }
            }
        }
        else {
            storage[i] = cluster[i];
            cluster[i] = mark_temp;
            mark_temp = mark_temp + 1;
        }
    }
    // console.log(cluster)

    var connection = inds
    for (var i = 0; i < connection.length; i++) {
        if (connection[i] != 0) {
            connection[i] = cluster[i]
        }
    }

    var data1 = new Array(points.length).fill(0);
    for (var i = 0; i < points.length; i++) {
        // console.log(points[i].x, points[i].y)
        data1[i] = [
            points[i].x,
            points[i].y,
            DCMs[i],
            connection[i],
            cluster[i],
        ]
    }
    // console.log(data1[1])

    var newKNN_Res = new Array(points.length).fill(0);
    var newClosestDis = new Array(points.length).fill(0);
    var data = data1.sort(function (a, b) { return a[4] - b[4] })
    var num = []
    for (var i = 0; i < data.length; i++) {
        sort: for (var j = 0; j < points.length; j++) {
            if (points[j].x === data[i][0] && points[j].y === data[i][1]) {
                num.push({ change: i, origin: j })
                break sort;
            }
        }
    }
    // console.log(num)

    for (var i = 0; i < num.length; i++) {
        newKNN_Res[num[i].change] = KNN_Res[num[i].origin]
        for (var t = 0; t < k; t++) {
            for (var s = 0; s < num.length; s++) {
                if (newKNN_Res[i][t].id === num[s].origin) {
                    newKNN_Res[i][t].id = num[s].change
                    break
                }
            }
        }
        for (var j = 0; j < num.length; j++) {
            if (num[j].origin === closestDis[num[i].origin]) {
                newClosestDis[i] = num[j].change
                break
            }
        }
    }
    const result = [data1, newKNN_Res, newClosestDis]
    // console.log(result)
    return result
}