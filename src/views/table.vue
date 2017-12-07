<style scoped lang="less">
  .ivu-page-prev{
     border: none;
  }
  .ivu-form-item{
    width : 250px;
  }
</style>
<template>
  <div>
      <Form ref="queryData" :model="queryData" :rules="queryValidate" :label-width="80"    inline>
          <FormItem label="业务编号" prop="wordID">
              <Input type="text" v-model="queryData.wordID"></Input>
          </FormItem>
          <FormItem label="组织类别" prop="orgniseType">
            <Select v-model="queryData.orgniseType">
                <Option value="beijing">beijing</Option>
                <Option value="shanghai">shanghai</Option>
                <Option value="shenzhen">shenzhen</Option>
            </Select>
          </FormItem>
          <FormItem label="提交时间" prop="submitDate">
              <DatePicker type="date" placeholder="请选择..." v-model="queryData.submitDate"></DatePicker>
          </FormItem>
          <FormItem label="完成时间" prop="finishDate">
              <DatePicker type="date" placeholder="请选择..." v-model="queryData.finishDate"></DatePicker>
          </FormItem>
          <FormItem  :label-width="80">
              <Button type="primary" @click="handleSubmit('queryData')" icon="ios-search" >搜索</Button>
              <Button type="ghost" @click="handleReset('queryData')" style="margin-left: 10px;border:none;color: blue;font-size: 12px;">高级搜索</Button>
          </FormItem>
      </Form>
     <Table stripe border :columns="tableHeader" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
              <Page :total="100" :current="1" @on-change="changePage" ></Page>
          </div>
      </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
            queryData: {
                    name: '',
                    wordID: '',
                    orgniseType: '',
                    submitDate: '',
                    finishDate: ''
                },
                queryValidate: {
                  wordID: [
                          { required: true, message: 'The field cannot be empty', trigger: 'blur' }
                        ]
                },
                tableData: this.creatTableData(),
                tableHeader: [
                    {
                        title: '序号',
                        key: 'idNo',
                    },
                    {
                        title: '业务编号',
                        key: 'wordNo',
                        render: (h, params) => {
                            const row = params.row;
                            const text = row.wordNo == 1 ? 'wwww.baidu.com' : row.wordNo == 1 ? 'www.bai.com': 'www.du.com';
                            return h('div', {
                                style: {
                                    textAlign: 'center',
                                    color: 'blue',
                                    size: '15',
                                    'text-decoration': 'underline',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.index)
                                    }
                                }
                            }, text);
                        }
                    },
                    {
                        title: '组织编号',
                        key: 'orgNo',
                        render: (h, params) => {
                          const text = params.row.orgNo;
                            return h('div', {
                                style: {
                                  textAlign: 'center',
                                  size: '15'
                                }
                            },text);
                        }
                    },
                    {
                        title: '组织名称',
                        key: 'orgname',
                        render: (h, params) => {
                          const text = params.row.orgname;
                            return h('div', {
                                style: {
                                  textAlign: 'center',
                                  size: '15'
                                }
                            },text);
                        }
                    },
                    {
                        title: '组织类别',
                        key: 'orgtype',
                        render: (h, params) => {
                          const text = params.row.orgtype;
                            return h('div', {
                                style: {
                                  textAlign: 'center',
                                  size: '15'
                                }
                            },text);
                        }
                    },
                    {
                        title: '提交时间',
                        key: 'submitTime',
                        render: (h, params) => {
                            return h('div', this.formateDate(this.tableData[params.index].submitTime));
                        }
                    },
                    {
                        title: '完成时间',
                        key: 'finishTime',
                        render: (h, params) => {
                            return h('div', this.formateDate(this.tableData[params.index].finishTime));
                        }
                    },
                    {
                        title: '操作者',
                        key: 'opreater',
                        render: (h, params) => {
                            return h('div', this.checkUser(this.tableData[params.index].opreater));
                        }
                    },
                    {
                        title: '编辑',
                        key: 'action',
                        width: 80,
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
                                     cursor: 'pointer'
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
                    }
                ]
            }
        },
        methods: {
            creatTableData () {
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push({
                        idNo: Math.floor(Math.random () * 5 + 1),
                        wordNo:  Math.floor(Math.random () * 3 + 1),
                        orgNo:  Math.floor(Math.random () * 1000000 + 100000),
                        orgname: 'People' + Math.floor(Math.random () * 100 + 1),
                        orgtype: 'type' + Math.floor(Math.random () * 100 + 1),
                        time: Math.floor(Math.random () * 7 + 1),
                        submitTime: new Date().getTime(),
                        finishTime: new Date().getTime()+(7*24*60*60*1000),
                        opreater: Math.floor(Math.random () * 5)
                    })
                }
                return data;
            },
            formateDate (date) {
                date = new Date(date);
                const y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? '0' + m : m;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                return y + '-' + m + '-' + d;
            },
            checkUser(opreaterID){
                let  opreaterArray = ['tom','jame','sunny','shine','bob','alice'];
                return opreaterArray[opreaterID];
            },
            changePage () {
                // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
                this.tableData = this.creatTableData();
            },
            show (index) {
                this.$Modal.info({
                    title: 'User Info',
                    content: `Name：${this.tableData[index].idNo}<br>Age：${this.tableData[index].wordNo}<br>Address：${this.tableData[index].wordNo}`
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                      this.$Modal.info({
                          title: '筛选条件',
                          content: `组织类型：${this.queryData.orgniseType}<br>提交时间：${this.queryData.submitDate}<br>完成时间：${this.queryData.finishDate}`
                      })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>
