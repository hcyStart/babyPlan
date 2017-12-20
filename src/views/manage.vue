<style scoped lang="less">

</style>
<template>
  <div class = "author-style">
    <Row>
      <Col span="14">
          <Form ref="queryData" :model="queryData"  :label-width="80"    inline>
              <FormItem label="角色名称" prop="roleName">
                  <Input type="text" placeholder="请选择..." v-model="queryData.roleName"></Input>
              </FormItem>
              <FormItem label="角色编码" prop="roleNo">
                  <Input type="text" placeholder="请选择..." v-model="queryData.roleNo"></Input>
              </FormItem>
              <FormItem>
                  <Button type="primary" @click="handleSubmit('queryData')" icon="ios-search" >搜索</Button>
              </FormItem>
          </Form>
      </Col>
      <Col span="2">
          <Button type="primary" style ="float:right"  icon="android-add" >新建</Button>
      </Col>
      <Col span="8">
          <Button type="primary" style ="float:right"  icon="android-add" >保存</Button>
      </Col>
    </Row>
    <Row>
    <Col span="16">
        <Table border :columns="tableListHeader" :data="tableData"></Table>
    </Col>
    <Col span="8">
        <Tree :data="data2" show-checkbox></Tree>
    </Col>
  </Row>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                queryData:{
                    roleName: '',
                    roleNo:''
                },
              tableListHeader: [
                  {
                    title: ' ',
                    width: 60,
                    align: 'center',
                    key:'keyselect'
                  },
                  {
                      title: '序号',
                      width: 80,
                      align: 'center',
                      key: 'No'
                  },
                  {
                      title: '角色名称',
                      key: 'roleName'
                  },
                  {
                      title: '角色编码',
                      key: 'roleNo'
                  },
                  {
                      title: '操作',
                      key: 'action',
                      width: 140,
                      align: 'center',
                      render: (h, params) => {
                       return h('div', [
                           h('Icon', {
                               props: {
                                   type: 'link',
                                   size: '20',
                                   color: 'blue'
                               },
                               style: {
                                   cursor: 'pointer',
                                   marginRight: '5px'
                               },
                               nativeOn: {
                                   click: () => {
                                       this.show(params.index)
                                   }
                               }
                           }),
                           h('Icon', {
                               props: {
                                   type: 'ios-trash',
                                   size: '20',
                                   color: 'blue'
                               },
                               style: {
                                   cursor: 'pointer',
                                   'margin-left': '35px'
                               },
                               nativeOn: {
                                   click: () => {
                                       this.show(params.index)
                                   }
                               }
                           })
                        ]);
                      }
                  }
              ],
              tableData: [
                  {
                      roleName: 'John Brown',
                      No: 1,
                      roleNo: 'New York No. 1 Lake Park',
                      date: '2016-10-03'
                  },
                  {
                      roleName: 'Jim Green',
                      No: 2,
                      roleNo: 'London No. 1 Lake Park',
                      date: '2016-10-01'
                  },
                  {
                      roleName: 'Joe Black',
                      No: 3,
                      roleNo: 'Sydney No. 1 Lake Park',
                      date: '2016-10-02'
                  },
                  {
                      roleName: 'Jon Snow',
                      No: 4,
                      roleNo: 'Ottawa No. 2 Lake Park',
                      date: '2016-10-04'
                  }
              ],
              data2: [
                    {
                        title: 'parent 1',
                        expand: true,
                        children: [
                            {
                                title: 'parent 1-1',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-1-1'
                                    },
                                    {
                                        title: 'leaf 1-1-2'
                                    }
                                ]
                            },
                            {
                                title: 'parent 1-2',
                                expand: true,
                                children: [
                                    {
                                        title: 'leaf 1-2-1'
                                    },
                                    {
                                        title: 'leaf 1-2-1'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        methods:{
          show (index) {
              this.$Modal.info({
                  title: 'User Info',
                  content: `Name：${this.tableData[index].No}<br>Age：${this.tableData[index].roleNo}<br>Address：${this.tableData[index].roleName}`
              })
          }
        }
    }
</script>
