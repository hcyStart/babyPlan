<style scoped lang="less">
    .edit-data{
      padding :20px 40px;
    }
    .ivu-input-group-prepend{
       background:#fff;
    }
    .line-space{
      margin-top:20px;
    }
</style>
<template>
  <div class = "edit-data">
          <Card>
              <p slot="title">业务活动</p>
              <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
              </Row>
              <div class = "line-space"></div>
              <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
              </Row>
              <div class = "line-space"></div>
              <Row>
                 <Col span = "24">
                    <Input v-model="value6" type="textarea" :rows="4" placeholder="Enter something...">
                        <span  slot="prepend">业务编号：</span>
                    </Input>
                 </Col>
              </Row>
          </Card>
          <div class = "line-space"></div>
          <Card>
              <p slot="title">业务活动</p>
              <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
              </Row>
              <div class = "line-space"></div>
              <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
              </Row>
              <div class = "line-space"></div>
              <Row type="flex" justify="space-between" class="code-row-bg">
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
                 <Col span = "6">
                     <Input type="text" v-model="eidtData.wordID" style = "background:#fff;">
                        <span  slot="prepend">业务编号：</span>
                     </Input>
                 </Col>
              </Row>
          </Card>
          <div class = "line-space"></div>
          <Row type="flex" justify="center" class="code-row-bg">
             <Col span = "6">
                 <Button type="ghost" icon="reply">Search</Button>
                 <Button type="primary" icon="printer">Search</Button>
                 <Button type="primary" icon="ios-filing">Search</Button>
             </Col>
          </Row>

  </div>
</template>
<script>
    export default {
        data () {
            return {
                eidtData:{

                }
            }
        }
    }
</script>
