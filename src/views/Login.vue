<template>
  <div class="login-container">
    <div class="box">
      <!-- 登陆logo -->
    <div class="login_logo">
      <img src="../assets/logo.png">
    </div>
    <!-- ref可以将注册信息挂载到vue实例上，实例上就会有$refs属性，该属性将会记录被注册的过ref的DOM对象 -->
    <el-form  label-width="0px" class="login_form" :model="form" :rules="loginrules" ref="loginFormRef">
      <!-- 账号 -->
      <el-form-item prop="username">
        <el-input prefix-icon="iconfont icon-user" v-model="form.username" ></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" ></el-input>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item class="btn" >
        <el-button type="primary" @click="login">登陆</el-button>
        <el-button type="info" @click="resetLoginForm">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      // 登录表单的数据绑定对象
      form: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginrules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮重置表单
    // this指向的时vue实例对象console.log(this);
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登陆校验
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 1将登陆成功之后的token, 保存到客户端的 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('home')
        // 1.1 项目中出来其它的api接口必须在登录成功之后才能访问
        // 1.2 token只应在当前网站打开期间生效，所以token保存在sessionStorage中
        // 2 通过编程时式导航跳转到后台主页，路由地址是/home
      })
    }
  }
};
</script>
<style lang='scss' scoped>
  .login-container{
    height:100%;
    background-color:#2b4b6b;
    .box {
      width:400px;
      height:300px;
      background-color:#fff;
      position:absolute;
      left:50%;
      top:50%;
      transform:translate(-50%,-50%);
      border-radius:3px;
      .login_logo {
        width:120px;
        height:120px;
        border-radius:50%;
        border:1px solid #eee;
        padding:10px;
        position:absolute;
        left:50%;
        transform: translate(-50%,-40%);
        background-color: #fff;
        border:0 0 10px #ddd;
      img{
          height:100%;
          border-radius:50%;
          background-color: #eee;
        }
      }
      .login_form{
        position:absolute;
        bottom:0;
        width:100%;
        padding:0 20px;
        box-sizing: border-box;
        .btn {
          padding-left:200px;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
