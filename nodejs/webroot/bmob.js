---query table
function onRequest(request, response, modules) {
    var db=modules.oData;
    db.find(
    	{"table":"fnd_viewcount"
        },function(err,data) {
            response.send(data);
        }
    )
}       
//return a json
{
    "results": [{
        "createdAt": "2016-10-16 22:09:56",
        "objectId": "SpdoAAAC",
        "totalPV": 0,
        "updatedAt": "2016-10-16 22:09:56"
    }, {
        "createdAt": "2016-10-18 19:46:03",
        "objectId": "9dHJ666B",
        "totalPV": 66,
        "updatedAt": "2016-10-18 19:46:03"
    }]
}

---insert into table
function onRequest(request, response, modules) {
    var db = modules.oData;
    db.insert({
        "table": "fnd_viewcount", //表名
        "data": {"totalPV": 166 } //需要更新的数据，格式为JSON
    }, function(err, data) { //回调函数
        response.send(err);
    });
}

---insert into table yg_poets:newPoetRequirement
function onRequest(request, response, modules) {
    var db = modules.oData;
    if (request.body.email != null) {
        db.insert({
            "table": "yg_poets", //表名
            "data": {
                "email": request.body.email,
                "requirement": request.body.poetSpecification
            } //需要更新的数据，格式为JSON
        }, function(err, data) { //回调函数
            if (err == null)
                response.send("提交成功，云哥儿想写诗的时候，自然会回复您！");
            else response.send(err);
        });

    } else {
        response.send("悟空你又贪玩")
    }
}
                                                                                    

