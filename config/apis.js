module.exports = [
  {
    id: "1",
    name: '招聘信息企业名称查询接口',
    description : "通过关键词查询企业名称及Id号",
    original_url : "http://54.222.183.148:3000/api/search",
    url: "/search",
    params: [{
      name: "uid",
      original_name: "uid",
      is_visible : true,
      default_value : "",         
      description : "用户秘钥"
    },{
      name: "key",
      original_name: "key",
      is_visible : true,
      default_value : "",          
      description : "用户查询关键字" 
    }],
    resultType: "xml",
    example: "这里是一些使用的描述"
  },
  {
    id: "2",
    name: '企业招聘职位查询接口',
    description : "通过企业ID号查询，查询该公司招聘的职位信息",
    original_url : "http://54.222.183.148:3000/api/search",
    url: "/getCompany",
    params: [{
      name: "uid",
      original_name: "uid",
      is_visible : true,
      default_value : "",
      description : "用户秘钥"
    },{
      name: "id",
      original_name: "id",
      is_visible : true,
      default_value : "",      
      description : "企业ID" 
    }],
    resultType: "xml",
    example: "这里是一些使用的描述"
  }
]