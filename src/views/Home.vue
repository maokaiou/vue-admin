<template>
<el-container class="home-container">
    <!-- 头部区 -->
    <el-header class="el-header">
      <div class="head-left">
        <img src="../assets/heima.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
    <!-- 侧边区 -->
    <el-aside :width="iscollapse? '60px': '200px'" class="el-aside">
      <div class="toggle-button" @click="toggle">|||</div>
      <!-- unique-opened,表示只展示一个子菜单，要加属性绑定不然其后面的值就是一个字符串，而不是布尔值 -->
      <!-- 开启router会以index作为路径进行跳转 -->
      <el-menu
      class="el-menu"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened = "true"
      :collapse = "iscollapse"
      :collapse-transition = "false"
      :router= "true">
      <!-- 一级菜单 -->
      <!-- 此处必须用一个index进行数据绑定，且要是字符串形式 ，数字类型加''可以变成字符串类型-->
      <!-- index必须时独一的，这样就不会导致触发一个一级导致所有的一级菜单都被触发 -->
        <el-submenu :index="'/'+item.path +''" class="el-submenu" v-for = "item in menuList" :key="item.id">
          <!-- 一级菜单模板块 -->
          <template slot="title">
            <i :class="menuListIcons[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
            <el-menu-item :index= "'/'+subItem.path +''" v-for= "subItem in item.children" :key="subItem.id">
              <!-- 二级菜单 -->
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 主体区 -->
    <el-main class="el-main">
      <!-- 放置路由占位符 -->
      <router-view></router-view>
    </el-main>
    </el-container>
</el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      menuListIcons: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      iscollapse: false
    }
  },
  created() {
    // 左权限管理
    this.leftMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async leftMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggle() {
      this.iscollapse = !this.iscollapse
    }
  }
}
</script>
<style lang="scss" scoped>
  .home-container {
    height:100%;
    .el-header {
      height:100px;
      background-color: #333744;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .head-left {
        display:flex;
        align-items: center;
        font-size: 20px;
      }
      span {
        margin-left:15px;
        color:#fff;
      }
    }
    .el-aside {
      background-color: #333744;
      width:70px;
      .toggle-button {
        background-color: #4A5064;
        color:#fff;
        font-size: 10px;
        line-height: 30px;
        text-align: center;
        letter-spacing: 0.3em;
        cursor: pointer;
      }
    }
  }
</style>
