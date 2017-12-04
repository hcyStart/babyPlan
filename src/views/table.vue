<template>
    <Table border :columns="columns7" :data="data6"></Table>
</template>
<script>
    export default {
        data () {
            return {
                columns7: [
                    {
                        title: '序号',
                        key: 'idNo',
                    },
                    {
                        title: '业务编号',
                        key: 'age'
                    },
                    {
                        title: '组织编号',
                        key: 'address'
                    },
                    {
                        title: '组织名称',
                        key: 'address'
                    },
                    {
                        title: '组织类别',
                        key: 'address'
                    },
                    {
                        title: '提交时间',
                        key: 'address'
                    },
                    {
                        title: '完成时间',
                        key: 'address'
                    },
                    {
                        title: '操作者',
                        key: 'address'
                    },
                    {
                        title: '编辑',
                        key: 'action',
                        width: 50,
                        align: 'center',
                        render: (h, params) => {
                         return h('div', [
                             h('Icon', {
                                 props: {
                                     type: 'edit',
                                     size: '16',
                                     color: 'blue'
                                 },
                                 style: {
                                     marginRight: '5px'
                                 },
                                 nativeOn: {
                                     click: () => {
                                         this.show(params.index)
                                     }
                                 }
                             })
                          ]);
                        }
                    },
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                ],
                data6: [
                    {
                        idNo: '1',
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park'
                    },
                    {
                        idNo: '1',
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park'
                    },
                    {
                        idNo: '1',
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park'
                    },
                    {
                       idNo: '1',
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park'
                    }
                ]
            }
        },
        methods: {
            show (index) {
            debugger;
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.data6[index].name}<br>Age：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                })
            }
        }
    }
</script>
