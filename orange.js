

function DomChoose(obj) {
    this.tabledom = null;
    this.SelParent = null;
    this.inputstorage = null;
    this.ele = obj.appendtarget;
    this.fn = obj.skulist;
    this.exType = obj.exType;
    this.selectedOptions = [];

    this.selfpa = [];//被选中的第一层数组
    console.log(this.ele);
    this.jsonData = [];
    this.pid = [];
    this.allCombin = [];
    this.storageInput = obj.storageInput;
    this.olddata = obj.olddata;
    this.firstParent();
    //this.setSelParent();
    this.splitKey = "@#@#@#@#@#@#@";
    this.afterDomCreated = obj.afterDomCreated;//每次表格创建完成是执行的回调函数；
    this.afterDataChanged = obj.afterDataChanged;//对表格中的数据进行修改时持续调用的回调函数

}



DomChoose.prototype = {
    //constructor: DomChoose,
    //设置父级的筛选属性列表
    setSelParent: function () {
        var Selfrag = document.createDocumentFragment();
        var SelParent = document.createElement("div");
        SelParent.className = "SelParent";
        Selfrag.appendChild(SelParent);
        this.ele.appendChild(Selfrag);
        this.SelParent = SelParent;

    },

    //对第一层级进行检索
    searchFirstDom: function() {
        var searchfirstbox = document.createElement("div");
        searchfirstbox.className = "searchfirstbox";
        searchfirstbox.innerHTML = "<input type='search' placeholder='输入你想查找的属性名称' class='fsearchintop'>";
        this.ele.appendChild(searchfirstbox);
        this.searchbox = searchfirstbox.querySelector(".fsearchintop");
    },
    searchFirst: function(box, thisP) {
        var val;
        box.addEventListener("input", function() {
            val = box.value;
            makeArray(thisP.querySelectorAll("._pafc")).forEach(function(item) {
                if(val == "") {
                    item.style.display = "block";
                } else {
                    if (item.innerHTML.indexOf(val) > -1) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                }
            })
        }, false);
    },



    //获取父级属性的列表
    getParentData: function () {
        return this.fn();
    },

    //第一层及父级
    firstParent: function() {

        //创建搜索框
        this.searchFirstDom();
        var _pa = this.getParentData();
        var _palen = _pa.length;
        var pafirst = document.createElement("div");
        pafirst.className = "pafirst";
        var _pafrag = document.createDocumentFragment();
        for(var i = 0; i < _palen; i++) {
            var _pafc = document.createElement("div");
            _pafc.className = "_pafc";
            _pafc.innerHTML = _pa[i].name;
            _pafc.dataset.id = _pa[i].id;
            _pafc.dataset.first = JSON.stringify(_pa[i]);
            _pafc.dataset.hidden = _pa[i].hidden;
            _pafrag.appendChild(_pafc);
            this.openSecondArray(_pafc);
        }
        pafirst.appendChild(_pafrag);
        this.ele.appendChild(pafirst);

        this.setSelParent();

        this.fpa = pafirst;
        this.searchFirst(this.searchbox, pafirst)


    },

    //选第一层父级，展开对应子集
    openSecondArray: function(fc) {
        var that = this;
        var _index;
        var dataf = JSON.parse(fc.dataset.first);
        fc.onclick = function() {
            fc.classList.toggle("fpachoosen");
            if(fc.classList.contains("fpachoosen")) {
                that.selfpa.push(dataf);
                that.createSecond(fc);
            } else {
                _index = that.selfpa.indexOf(dataf);
                that.selfpa = that.selfpa.slice(0, _index).concat(that.selfpa.slice(_index + 1, that.selfpa.length));
                that.delUnneedSecond(fc);
            }
            that.getSelectedOptions();
            that.getTableDomData();
        };

        this.appendSendData(fc, dataf)
        
    },


    //如果一进来就传进来旧数据，那么得根据数据格式展开对应的层级；
    appendSendData: function(fc, dataf) {

        //调用事件早于父级dom创建，所以采用异步
        setTimeout(function() {
            if(this.olddata) {

                var _oladt = this.olddata;
                var _pid = _oladt[0].pid;
                if(_pid.indexOf(dataf.id) > -1) {
                    fc.click();
                }
            }
        }.bind(this));
    },

    //生成选中的第二层
    createSecond: function(fc) {
        var fp = JSON.parse(fc.dataset.first);
        var parentlisthtml = "";
        var parentList = document.createElement("div");
        parentList.dataset.id = fp.id;
        parentList.className = "parentList";
        var secondChildEvent = this.secondChildEvent;
        parentlisthtml += "<div class='parenteachname' data-id='" + fc.dataset.id + "'>" + fp.name + "</div><div class='childlist'>";
        for (var j = 0; j < fp.child.length; j++) {
            parentlisthtml += "<div data-pid='" + fc.dataset.id + "' data-childid='" + fp["child"][j]["childid"] + "' class='eachchild'>" + fp["child"][j]["name"] + "</div>";

        }
        parentList.innerHTML = parentlisthtml + "</div>";
        fc.childdom = parentList;
        this.SelParent.appendChild(parentList);
    },


    //删除某个二级
    delUnneedSecond:function(fc) {

        fc.childdom.parentNode.removeChild(fc.childdom);
    },


    //给每个二级菜单的子元素绑定点击事件
    secondChildEvent: function(ele) {
        var that = this;
        ele.onclick = function () {

            window.time = new Date().valueOf();

            this.classList.toggle("hchecked");
            that.getTableDomData();
        }
    },


    //获取当前被选中的属性，如果有老数据，则把老数据对应的属性选中
    getSelectedOptions: function () {
        var that = this;

        var childlist = makeArray(this.SelParent.querySelectorAll(".eachchild"));

        if(this.olddata) {
            var olddata = this.olddata;
            childlist.forEach(function(item) {
                var pid = item.dataset.pid;
                var childid = item.dataset.childid;
                var ele = item;
                var pindex;
                olddata.forEach(function(item) {
                    var odp = item.pid.split(",");
                    var odc = item.childid.split(",");
                    if(odp.indexOf(pid) > -1) {
                        pindex = odp.indexOf(pid);
                        if(odc[pindex] == childid) {
                            ele.classList.add("hchecked");
                        }
                    }
                })
            });
            that.getTableDomData.call(this);
        }

        childlist.forEach(function (ele) {
            ele.onclick = function () {

                window.time = new Date().valueOf();

                this.classList.toggle("hchecked");
                that.getTableDomData();
            }
        })
    },
    getTableDomData: function() {
        var that = this;
        if(this.tabledom) {
            this.tabledom.innerHTML = "";
        }

        if(!that.SelParent.querySelector(".hchecked")) {
            return;
        }

        /*检查行*/
        var row = 0;
        var eachlie = {};
        makeArray(this.SelParent.querySelectorAll(".parentList")).forEach(function (item, index) {
            var pid = item.querySelector(".parenteachname").dataset.id;
            eachlie["num" + index] = {};
            var _list = makeArray(item.querySelectorAll(".eachchild"));
            var _name = item.querySelector(".parenteachname").innerHTML;
            eachlie["num" + index].len = 0;
            eachlie["num" + index].name = _name;
            eachlie["num" + index].child = [];
            for (var j = 0; j < _list.length; j++) {

                if (_list[j].classList.contains("hchecked")) {
                    eachlie["num" + index].len++;
                    eachlie["num" + index].child.push(_list[j].innerHTML + that.splitKey + _list[j].dataset.childid);
                }

            }

            for (var i = 0; i < _list.length; i++) {
                if (_list[i].classList.contains("hchecked")) {
                    row++;
                    eachlie["num" + index].havechild = "true";
                    eachlie["num" + index].pid = pid;
                    break;
                }
            }

        });
        that.tableDom(row, eachlie);

    },
    
    //表单及事件绑定在这里完成
    tableDom: function (row, eachlie) {
        var _baseH = 40;
        var that = this;
        var arr = [];
        var allele = [];
        for (var i in eachlie) {
            var _sl = eachlie[i];
            if (_sl.havechild == "true") {
                allele.push(_sl);
                arr.push(_sl.child.length);
            }
        }
        //console.log(allele);
        var arrHeight = [];
        arrHeight[row - 1] = _baseH;
        for (var j = arr.length - 1; j > 0; j--) {
            arrHeight[j - 1] = arrHeight[j] * arr[j]
        }
        //console.log(arr);
        //console.log(arrHeight);
        var prebosslen = 1;

        var frag = document.createDocumentFragment();

        allele.forEach(function (ele, index, arg) {

            var nowban = index;
            if (index > 0) {
                prebosslen *= arg[index - 1]["child"].length;
            }
            var bossbox = document.createElement("div");

            bossbox.className = "bossbox";
            bossbox.setAttribute("pid", ele.pid);
            var boxtitle = document.createElement("div");
            boxtitle.innerHTML = ele.name;
            boxtitle.className = "boxtitle";
            bossbox.appendChild(boxtitle);
            for (var i = 0; i < prebosslen; i++) {
                ele["child"].forEach(function (item, index) {
                    var box = document.createElement("div");
                    box.className = "childbox box" + index;
                    var nameAid = item.split(that.splitKey);
                    box.innerHTML = nameAid[0];
                    box.setAttribute("id", nameAid[1]);
                    box.style.height = arrHeight[nowban] + "px";
                    bossbox.appendChild(box);
                });
            }

            frag.appendChild(bossbox);
        });

        var allbox = 1;
        for (var a = 0; a < arr.length; a++) {
            allbox *= arr[a];
        }

        this.typeAppend(allbox, frag);
        var jsonbtn = document.createElement("div");
        jsonbtn.className = "jsonbtn";
        jsonbtn.innerHTML = "生成";
        frag.appendChild(jsonbtn);

        var tabledomplace;
        if(this.tabledom == null) {
            tabledomplace = document.createElement("div");
            tabledomplace.className = "tabledomplace";

            this.ele.appendChild(tabledomplace);
            this.tabledom = tabledomplace;
        }
        this.tabledom.appendChild(frag);

        this.valueBoxSign(allele, allbox);

        //this.getJson(allele, allbox);
        this.storageNewData();
        this.setOldData();
        this.jsonDatastore();
        //console.log(new Date().valueOf() - window.time)
        if(this.inputstorage == null) {
            var inputstorage = document.createElement("input");
            inputstorage.className = "inputstorage";
            inputstorage.type = "hidden";
            that.ele.appendChild(inputstorage);
            this.inputstorage = inputstorage;
        }
        
        
        if(typeof this.afterDomCreated == "function") {
            this.afterDomCreated.call(this, this);
        }
    },
    jsonDatastore: function() {
        this.tabledom.querySelector(".jsonbtn").onclick = function() {
            if(this.allMustVerify()) {
                this.getJson.call(this);
                this.getStorageData.call(this)
            } else {
                alert("请填写必填项（标题带*的）")
            }
        }.bind(this);
    },
    typeAppend: function (len, frag) {
        var exType = this.exType;
        var exbossbox = document.createElement("div");
        exbossbox.className = "exbossbox";

        var extitlebox = document.createElement("div");
        extitlebox.className = "extitlebox";
        exType.forEach(function (item) {
            var extypetitle = document.createElement("div");
            extypetitle.className = "extypetitle";
            extypetitle.innerHTML = item.must ? "<em style='color:#ff0000;'>* </em>" + item.zhName : item.zhName;
            extypetitle.dataset.must = item.must;
            extitlebox.appendChild(extypetitle);

            if(item.hidden == true) {
                extypetitle.style.display = "none";
            }

        });
        exbossbox.appendChild(extitlebox);
        var exconbox = document.createElement("div");
        exconbox.className = "exconbox";
        var ehextype;
        for (var i = 0; i < len; i++) {
            var exconeach = document.createElement("div");
            exconeach.className = "exconeach";

            for (var j = 0; j < exType.length; j++) {
                ehextype = exType[j];
                var exboxchild = document.createElement("div");
                var input = document.createElement("input");
                input.type = "text";
                input.dataset.typeid = ehextype.typeid;
                input.dataset.zhName = ehextype.zhName;
                input.dataset.name = ehextype.name;
                input.dataset.must = ehextype.must;
                exboxchild.className = "exboxchild";
                exboxchild.appendChild(input);

                //判断该列是否是隐藏框
                if(ehextype.hidden == true) {
                    exboxchild.style.display = "none";
                }


                //判断是否是选择框
                if(ehextype.selarr) {
                    var selviewdiv = document.createElement("div");
                    selviewdiv.className = "orange-sel-view";
                    exboxchild.appendChild(selviewdiv);
                    input.disabled = "disabled";
                    input.type = "hidden";
                    input.classList.add("orange-sel-input");
                    this.likeSelect(exboxchild, ehextype.selarr, input, selviewdiv);
                }
                exconeach.appendChild(exboxchild);

            }
            exconbox.appendChild(exconeach);

        }
        exbossbox.appendChild(exconbox);
        frag.appendChild(exbossbox);
    },

    //模拟下拉框
    likeSelect: function(tar, arr, valueinput, selviewdiv) {
        var error = "请设置selarr为一个json数组，并且包含value和name字段名";
        if(!Array.isArray(arr)) throw new TypeError(error);
        if(typeof arr[0].name == "undefined" || typeof arr[0].value == "undefined") {
            throw new TypeError(error);
        }
        var ul = document.createElement("ul");
        ul.className = "orange-sel";
        var arrN;
        for(var i = 0, len = arr.length; i < len; i++) {
            arrN = arr[i];
            var li = document.createElement("li");
            li.className = "orange-opt";
            li.innerHTML = arrN.name;
            li.dataset.value = arrN.value;
            ul.appendChild(li);
            this.orangeOptSelected(li, ul, valueinput, selviewdiv);
        }
        tar.appendChild(ul);
        this.openCloseSelect(tar, ul)
    },

    //开关下拉框
    openCloseSelect: function(res, sel) {
        res.onclick = function() {
            if(sel.classList.contains("orange-sel-open")) {
                sel.classList.add("orange-sel-hide");
                sel.classList.remove("orange-sel-open");
            } else {
                sel.classList.add("orange-sel-open");
                sel.classList.remove("orange-sel-hide");
            }
        }
    },

    //选择值后，关闭下拉框
    orangeOptSelected: function(res, tar, valueinput, selviewdiv) {
        var that = this;
        res.onclick = function() {
            tar.classList.add("orange-sel-hide");
            valueinput.value = res.dataset.value;
            selviewdiv.innerHTML = res.innerHTML;
            res.classList.add("orange-opt-choosen");
            that.getJson.call(that);
        }
    },

    getOldData: function() {

        if(this.olddata) {
            return this.olddata
        }

        if(this.inputstorage != null) {
            var val = this.inputstorage.value;
            if(val == "") {
                return false;
            } else {
                //console.log(val);
                return JSON.parse(val);
            }
        } else {
            return false;
        }
    },
    setOldData: function() {
        var that = this;
        var pid, childid, typename;
        var olddata = that.getOldData();
        if(!olddata) return;
        var input = makeArray(document.querySelectorAll(".exbossbox input"));
        input.forEach(function(item) {
            pid = item.dataset.pid;
            childid = item.dataset.childid;
            typename = item.dataset.name;
            var ele = item;
            var pcCombie = pid.split(",").map(function(item, index) {
                return [item, childid.split(",")[index]]
            });
            
            olddata.forEach(function(item) {
                if(that.isArrayEachEqual(pid.split(","), item.pid.split(","))) {
                    var pcCombie2 = item.pid.split(",").map(function(citem, index) {
                        return [citem, item.childid.split(",")[index]]
                    });

                    var elevalue;

                    if(that.isArrayEachEqual(pcCombie, pcCombie2)) {
                        for(var key in item["text"]) {
                            if(key == typename) {
                                elevalue = ele.value = item["text"][key];
                                if(ele.parentNode.querySelector(".orange-sel-view")) {
                                    var divview = ele.parentNode.querySelector(".orange-sel-view");

                                    var orangeselopt = makeArray(ele.parentNode.querySelectorAll(".orange-sel li"));

                                    for(var optI = 0, optlen = orangeselopt.length; optI < optlen; optI++) {
                                        var orangeseloptI = orangeselopt[optI];
                                        if(orangeseloptI.dataset.value == elevalue) {
                                            orangeseloptI.classList.add("orange-opt-choosen");
                                            divview.innerHTML = orangeseloptI.innerHTML;
                                            return;
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
            })
        })
    },


    //检查两个数组是否所有元素都一样，并且长度一样
    isArrayEachEqual:function(arr1, arr2) {
        var len1 = arr1.length;
        var len2 = arr2.length;
        arr1 = arr1.map(function(item) {
            return item.toString();
        });
        arr2 = arr2.map(function(item) {
            return item.toString();
        });
        if(len1 != len2) return false;

        for(var index in arr1) {
            if(arr2.indexOf(arr1[index]) < 0) {
                return false
            }
        }
        return true;
    },

    valueBoxSign: function(allele, allbox) {
        var that = this;
        that.pid = [];
        makeArray(this.tabledom.querySelectorAll(".bossbox")).forEach(function (item) {
            that.pid.push(item.getAttribute("pid"));
        });

        var allchildcombin = [];
        var allnewcombin = [];
        allele.forEach(function (item) {
            var _arr = [];
            item.child.forEach(function (item) {
                _arr.push(item.split(that.splitKey)[1])
            });
            allchildcombin.push(_arr);
        });


        var needtime = [];
        allchildcombin.forEach(function(item, index) {
            if(index == allchildcombin.length - 1) return;
            var prevHave = 1;
            for(var c = index + 1 ; c < allchildcombin.length; c++) {
                prevHave *= allchildcombin[c].length;
            }
            needtime.push(prevHave)
        });

        needtime.push(1);
        var lastchild = allchildcombin[allchildcombin.length - 1];

        //console.log(showtimes, timesback, allbox, allchildcombin)
        //[12, 20, 5] [60, 60, 20, 5] 60 [Array[1], Array[3], Array[4], Array[5]]

        ///*获取所有组合*/
        var childlen = allchildcombin.length;
        for (var i = 0; i < allbox; i++) {
            if(needtime.length == 0) break;
            allnewcombin[i] = [];

            allchildcombin.forEach(function (item, index, arg) {
                var _need = needtime[index];

                var nowban;
                //目前要取的item的第几个，
                nowban = Math.floor(i / _need);


                //如果要取的索引大于item的长度，进行取余
                if(nowban >= item.length) {
                    nowban = nowban % item.length;
                }

                allnewcombin[i].push(item[nowban]);

            })

        }


        /*//获取bossbox的
        var allPType = [];
        var bossBox = makeArray($$(".bossbox", true));
        //将bossbox里面的每一级的id放到各自数组
        bossBox.forEach(function(item, index) {
            allPType[index] = [];
            makeArray(item.querySelectorAll(".childbox")).forEach(function(item2) {
                var id = item2.getAttribute("id");
                allPType[index].push(id);
            })
        });
        console.log(allPType)

        for(var i = allPType.length - 1; i > 0; i--) {
            var finalarr = [];
            //从后往前将id放入
            var bl = allPType[i].length / allPType[i - 1].length;

            var prev = allPType[i - 1];
            prev.forEach(function(item3) {
                var _arr = [];
                for(var j = 0; j < bl; j++) {
                    _arr.push([item3, allPType[i][j]])
                }

            });

        }*/

        this.allCombin = allnewcombin;
        makeArray(this.tabledom.querySelectorAll(".exconeach")).forEach(function (item, index) {
            makeArray(item.querySelectorAll("input")).forEach(function (item) {
                item.dataset.childid = allnewcombin[index];
                item.dataset.pid = that.pid;
            });
        });
    },

    //判断必填项都填了没有
    allMustVerify: function() {
        var must;
        var exconeach = makeArray(this.tabledom.querySelectorAll(".exconeach"));
        for(var i = 0; i < exconeach.length; i++) {
            var _input = makeArray(exconeach[i].querySelectorAll("input"));
            for(var  j = 0; j < _input.length; j++) {
                must = _input[j];
                if(must.dataset.must == "true" && must.value == "") {
                    must.focus();
                    return false;
                }
            }
        }

        return true;

    },

    getJson: function () {
        var that = this;

        var _json = [];
        var typename, typeid, typevalue, text;
        makeArray(this.tabledom.querySelectorAll(".exconeach")).forEach(function (item, index) {
            text = {};
            _json[index] = {};
            makeArray(item.querySelectorAll("input")).forEach(function (item) {

                typename = item.dataset.name;
                typeid = item.dataset.typeid;
                typevalue = item.value;
                text[typename] = typevalue;

            });
            _json[index].pid = that.pid.toString();
            _json[index].childid = that.allCombin[index].toString();
            _json[index].text = text;
        });
        that.jsonData = _json;
        //this.getStorageData()
        this.olddata = _json;
        //this.inputstorage.value = JSON.stringify(_json);

    },
    getStorageData: function() {

        if(this.jsonData.length == 0) {
            this.jsonData = this.olddata;
        }
        var _jsondata = JSON.stringify(this.jsonData);
        this.inputstorage.value = _jsondata;
        this.storageInput.value = _jsondata;
        this.olddata = this.jsonData;
        alert("数据生成成功");
    },
    storageNewData: function() {
        var that = this;
        makeArray(this.tabledom.querySelectorAll(".exboxchild input")).forEach(function(item) {
            item.addEventListener("input", that.getJson.bind(that), false);
        })
    }
};


Object.defineProperty(DomChoose.prototype, "constructor", {
    enumerable: false,
    value: DomChoose
});