<template>
    <Tree :data="baseData" show-checkbox multiple></Tree>
</template>
<script>
    export default {
        data () {
            return {
                baseData: []
            }
        },
        methods:{
            getTree(){
                var start = new Date().getTime();//起始时间
                //准备数据
                let testData = {
                    "department": [
                        {
                            "departmentName": "测试1",
                            "departmentDesc": "盛达康网络",
                            "parentId": "",
                            "id": "594a28fb1c8652a01f0301"
                        },
                        {
                            "departmentName": "测试-一级子级",
                            "parentId": "594a28fb1c8652a01f0301",
                            "id": "594a3910202469941"
                        },
                        {
                            "departmentName": "测试-二级子级",
                            "parentId": "594a3910202469941",
                            "id": "594a391020246994asasd1"
                        },
                        {
                            "departmentName": "盛达康",
                            "departmentDesc": "盛达康网络",
                            "parentId": "",
                            "id": "594a28fb1c8652a01f030126"
                        },
                        {
                            "departmentName": "开发",
                            "parentId": "594a28fb1c8652a01f030126",
                            "id": "594a3910202469941c349d7c"
                        },
                        {
                            "departmentName": "运营",
                            "parentId": "594a28fb1c8652a01f030126",
                            "id": "594a4509202469941c349d7f"
                        },
                        {
                            "departmentName": "人事",
                            "parentId": "594a28fb1c8652a01f030126",
                            "id": "59522e3ef30415281805d39f"
                        },
                        {
                            "departmentName": "瞧瞧",
                            "parentId": "594a3910202469941c349d7c",
                            "id": "597842fc51ec7f80118aa94c"
                        },
                        {
                            "departmentName": "测试层",
                            "parentId": "594a4509202469941c349d7f",
                            "id": "5978436751ec7f80118aa94d"
                        },
                        {
                            "departmentName": "测试1",
                            "parentId": "5978436751ec7f80118aa94d",
                            "id": "5979ad338c9082580984cf0a"
                        },
                        {
                            "departmentName": "测试2",
                            "parentId": "5979ad338c9082580984cf0a",
                            "id": "5979ad418c9082580984cf0b"
                        },
                        {
                            "departmentName": "测试3",
                            "parentId": "5979ad418c9082580984cf0b",
                            "id": "5979ad568c9082580984cf0c"
                        },
                        {
                            "departmentName": "测试4",
                            "parentId": "5979ad568c9082580984cf0c",
                            "id": "5979ad648c9082580984cf0d"
                        }
                    ]
                }
                var data = testData.department
                let treedata = []
                //查找最顶层
                let len = data.length
                for(let j=0;j<len;j++){
                    data[j].expand = false
                    data[j].title = data[j].departmentName
                    if(data[j].parentId == ""){
                        treedata.push({
                            "expand":true,
                            "title":data[j].departmentName,
                            "id":data[j].id
                        })
                    }
                }
                //找到跟最高层id相关的子子孙孙，并给子孙添加lev
                var treedataLevs =[]
                for(let h=0,ls=treedata.length;h<ls;h++){
                    treedataLevs.push({
                        treedataLev:sonsTree(data,treedata[h].id)
                    })
                }
                console.log(treedataLevs)
                for(let p=0,lq=treedataLevs.length;p<lq;p++){
                    var treedataLev = treedataLevs[p].treedataLev
                    //找到最高层的lev
                    var maxLev = 0
                    for(let i=0,lt=treedataLev.length;i<lt;i++){
                        if(parseInt(treedataLev[i].lev) > maxLev){
                            maxLev = parseInt(treedataLev[i].lev)
                        }else{
                            maxLev = maxLev
                        }
                    }
                    //比较当前层和上一层的数据，然后做处理
                    var needLev = maxLev
                    var maxLevTree = []
                    var maxLevTreePrev = []
                    for(let m=0;m<maxLev;m++){
                        maxLevTree = getLevArr(treedataLev,needLev)
                        maxLevTreePrev = getLevArr(treedataLev,needLev-1)
                        for(var j=0,lp=maxLevTreePrev.length;j<lp;j++){
                            maxLevTreePrev[j].children = new Array()
                            for(var i=0,lm=maxLevTree;i<lm.length;i++){
                                if(maxLevTree[i].parentId == maxLevTreePrev[j].id){
                                    maxLevTreePrev[j].children.push(maxLevTree[i])
                                }
                            }
                        }
                        needLev--
                    }
                    treedata[p].children = maxLevTreePrev
                }

                this.baseData = treedata
                //找出同一级的数据
                function getLevArr(arr,lev){
                    var newarr = []
                    for(let i=0,la=arr.length;i<la;i++){
                        //这里对arr 的children 做处理
                        arr.children = new Array()
                        if(parseInt(arr[i].lev) == lev){
                            newarr.push(arr[i])
                        }
                    }
                    return newarr
                }
                //给每个数据添加一个lev
                function sonsTree(arr,id){
                    var temp = [],lev=0;
                    var forFn = function(arr, id,lev){
                        for (var i = 0; i < arr.length; i++) {
                            var item = arr[i];
                            if (item.parentId==id) {
                                item.lev=lev;
                                temp.push(item);
                                forFn(arr,item.id,lev+1);
                            }
                        }
                    };
                    forFn(arr, id,lev);
                    return temp;
                }
                var end = new Date().getTime();//结束时间
                console.log("Tree初始化的时间是"+(end - start)+"ms")//返回函数执行需要时间
            }
        },
        created:function(){
            this.getTree()
        }
    }
</script>
