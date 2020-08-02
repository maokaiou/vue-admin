<template>
    <div class="userList">
        <!-- 卡片区内容 -->
        <el-card class="box-card">
            <!-- 搜索和用户添加 -->
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="userRequestData.query" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="userList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户数据表格 -->
            <el-table
                border
                style="width: 100%"
                class="userTable"
                :data= "userData">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column  label="状态">
                  <template slot-scope="scope">
                    <!-- {{scope.row.mg_state}} -->
                    <el-switch
                      v-model="scope.row.mg_state"
                      @change="userStatusChange(scope.row)"
                    >
                    </el-switch>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="操作" width="180px">
                  <template slot-scope ="scope">
                    <!-- 修改用户信息按钮 -->
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserInfor(scope.row.id)"></el-button>
                    <!-- 删除用户 -->
                    <el-button type="warning" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                    <!-- 为用户分配角色 -->
                     <el-tooltip class="item" effect="dark" content="设置" placement="top-end">
                        <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
                      </el-tooltip>
                  </template>
                </el-table-column>
            </el-table>
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="userList.pagenum"
                  :page-sizes="[2, 3, 4, 10]"
                  :page-size="userList.pagesize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
        </el-card>
    <!-- 添加用户的对话框 -->
    <!-- @close当关闭对话框触发的事件-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
    <!-- 对话主体区 -->
    <el-form ref="addUserRef" :model="addUserData" label-width="100px" :rules="addFormRules">
      <el-form-item prop="username" label="用户名">
        <el-input v-model="addUserData.username"></el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="addUserData.password"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="addUserData.email"></el-input>
      </el-form-item>
      <el-form-item prop="mobile" label="手机号码">
        <el-input v-model="addUserData.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 对话尾部区 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUserSuccess">确 定</el-button>
    </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" >
      <el-form :model="editUserData" :rules="EditInforRules" ref="EditUserRef" label-width="100px" @close="editDialogClose">
        <el-form-item label="id" prop="id">
          <el-input v-model="editUserData.id" :disabled="true"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
         <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserSuccess">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 验证邮箱校验规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (regEmail.test(value)) return callback()
      callback(new Error('请输入合法邮箱'))
    }
    // 验证手机校验规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3|4|5|7|8][0-9]{9}$/
      if (regMobile.test(value)) return callback()
      callback(new Error('请输入合法手机号'))
    }
    return {
      userData: [],
      userRequestData: {
        // 获取用户列表参数对象
        query: '',
        // 当前页码
        pagenum: 1,
        // 当前每页显示的最多条数据
        pagesize: 3
      },
      total: 0,
      // 添加用户所需请求参数
      // 添加用户表单绑定数据
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户对话框是否打开
      addDialogVisible: false,
      // 编辑用户信息对话框是否打开
      editDialogVisible: false,
      // 添加用户表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符之间' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3到10个字符' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户信息请求参数
      editUserData: {
        id: '',
        email: '',
        mobile: ''
      },
      // 编辑用户表单验证规则
      EditInforRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.userList()
  },
  methods: {
    // 初始化整个页面
    async userList() {
      const { data: res } = await this.$http.get('users', { params: this.userRequestData })
      if (res.meta.status !== 200) return this.$message.error(res.meta.status)
      this.userData = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(val){
      // console.log('每页' + val + '条')
      this.userRequestData.pagesize = val
      // pagesize发生改变，我们重新发起数据请求
      this.userList()
      // console.log('ni' + this.userRequestData.pagesize)
    },
    // 监听 页码值 改变事件
    handleCurrentChange(val){
      // console.log('当前页' + val)
      this.userRequestData.pagenum = val
      this.userList()
    },
    // 更新用户状态
    async userStatusChange(userInfor){
      const { data: res } = await this.$http.put(`users/ ${userInfor.id} /state/${userInfor.mg_state}`)
      if (res.meta.status !== 200) {
        userInfor.mg_state = !userInfor.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    // 取消添加用户对话框时对内容进行重置
    addDialogClose() {
      console.log(this.$refs)
      this.$refs.addUserRef.resetFields()
    },
    // 添加用户是否成功
    addUserSuccess() {
      this.$refs.addUserRef.validate(async valid => {
        if (valid === 'false') return
        // 添加用户
        const { data: res } = await this.$http.post('users', this.addUserData)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败')
        }
        this.$message.success('添加用户成功')
        this.addDialogVisible = false
        this.userList()
      })
    },
    // 编辑的用户信息中获取用户的参数
    async editUserInfor(id){
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      // console.log(res)
      // this.editUserData.id = res.data.id
      // this.editUserData.email = res.data.email
      // this.editUserData.mobile = res.data.mobile
      if (res.meta.status !== 200) return this.$message.error('请求用户数据失败')
      this.editUserData = res.data
    },
    // 修改用户信息对话框关闭对内容进行重置
    editDialogClose() {
      // console.log(this.$refs)
      this.$refs.editUserRef.resetFields()
    },
    // 修改用户信息并提交
    editUserSuccess() {
      this.$refs.EditUserRef.validate(async valid => {
        if (!valid) return this.$message.error('仔细检查填写信息')
        const { data: res } = await this.$http.put('users/' + this.editUserData.id, {
          email: this.editUserData.email,
          mobile: this.editUserData.mobile
        })
        console.log(res)
        this.$message.success(res.meta.msg)
        this.editDialogVisible = false
        this.userList()
      })
    },
    // 删除用户
    async removeUserById(id) {
      const confirmInfor = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 点击确认放回的是confirm
      // 点击取消返回的是cancel,此处要惊醒一场捕获，因为await只负责接受promise的成功值
      // console.log(typeof (confirmInfor))
      if (confirmInfor !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败')
      this.$message.success('删除用户成功')
      this.userList()
    }
  }
}
</script>
<style lang="scss">
    .box-card {
        box-shadow: 0 0 1px ragb(0,0,0,0.5);
        .userTable {
            margin-top: 8px;
        }
        .el-pagination {
          margin-top: 10px;
        }
    }
</style>
