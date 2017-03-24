# sku
创建数据表单
```
var parentData = [{name:"颜色",id:763,child:[{name:"粉色",childid:764},{name:"藏青",childid:765},{name:"灰色",childid:766},{name:"深灰",childid:771},{name:"黑色",childid:772},{name:"黄色",childid:773},{name:"图片色",childid:780}]},{name:"尺码",id:767,child:[{name:"M",childid:768},{name:"L",childid:769},{name:"XL",childid:770},{name:"XXL",childid:776},{name:"S",childid:781},{name:"XXXL",childid:782}]}]
var selarr = [{value:1,name:"xxx"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"},{value:2,name:"vvv"}]
var sel = new DomChoose({
        appendtarget: document.querySelector("div"),
        exType:[
            {zhName: "市场价", name: "Official_price",must:true},
            {zhName: "销售价", name: "CommodityPrice",must:true},
            {zhName: "结算价", name: "SettlementPrice",must:true},
            //{zhName: "返利佣金", name: "Return_price",must:true,selarr:selarr},
            {zhName: "返利佣金", name: "Return_price",must:true,hidden:true},
            {zhName: "库存/数量", name: "Count",must:true}
        ],//列表文本框
        skulist: function() {
            return parentData;
        },
        storageInput: document.querySelector("input"),
        afterDomCreated: function(data) {
            console.log(data);
        },
        afterDataChanged: function(data) {
            console.log(data);
        },
        olddata: [{"pid":"1,2","childid":"1,3,1","text":{"price":"adwd","count":"2","time":""}},{"pid":"1,2,3","childid":"1,1,2","text":{"price":"awd","count":"2","time":""}}]
});
```


# params
 - ```appendtarget: 表单生成的所在dom。```
 - ```exType: 需要填写的数据表头名， 包括中文名zhName， 英文名name， must：true表示该项必填， selarr：如果是数组，表单这个位置就会是下拉框， hidden：true，会隐藏这一列```
 - ```skulist：该表单的属性来源 ，格式按照上面例子```
 - ```storageInput：点击生成按钮，数据将会保存到该input控件```
 - ```olddata：这是之前通过该表单生成的数据，传入格式一致的数据，表单会在初始化时直接生成对应表单```
