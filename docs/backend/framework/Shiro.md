---
title: Shiro
---

shiro官网：https://shiro.apache.org/

# 基本了解

## 登陆认证

### 1、登陆认证概念

（1）身份验证：一般需要提供如身份ID等一些标识信息来表明登陆者的身份，如提供email，用户名/密码来证明

（2）在shiro中，用户需要提供principals（身份）和credentials（证明）给shiro，从而应用能验证用户身份。

### 2、登陆认证过程

（1）收集用户名/凭证，如用户名/密码

（2）调用Subject.login进行登陆，如果失败将得到相应的AuthenticationException异常信息，根据异常提示用户错误信息；否则登陆成功

（3）创建自定义的Realm类，继承org.apache.shiro.realm.AuthenticationRealm类实现`doGetAuthenticationInfo()`方法。

这里简单化通过一个demo演示下基本的登陆认证过程：

首先，我们初始化一个SpringBoot项目，然后引入shiro所需的核心依赖和日志相关依赖包：

```xml
<!--shiro核心依赖包&日志包-->
<dependency>
  <groupId>org.apache.shiro</groupId>
  <artifactId>shiro-core</artifactId>
  <version>1.9.0</version>
</dependency>
<dependency>
  <groupId>commons-logging</groupId>
  <artifactId>commons-logging</artifactId>
  <version>1.2</version>
</dependency>
```

接着，我们在resources中定义一个ini文件，方便模拟数据库的用户信息：

```xml
[users]
zhangsan=z3
lisi=l4
```

最后，定义一个ShiroRun测试类，进行模拟登陆认证的操作：

```java
public class ShiroRun {
    public static void main(String[] args) {
        //第一步：初始化获取SecurityManager对象
        IniSecurityManagerFactory factory = new IniSecurityManagerFactory("classpath:shiro.ini");
        SecurityManager securityManager = factory.getInstance();
        SecurityUtils.setSecurityManager(securityManager);
        //第二步：获取Subject对象
        Subject subject = SecurityUtils.getSubject();
        //第三步：创建Token对象，演示web应用用户密码登陆
        AuthenticationToken token = new UsernamePasswordToken("zhangsan", "z3");
        //第四步：完成登陆
        try {
            /**
             * 这里的login方法，查看其源码可以深入到最后的Realm类中，其中的方法如下所示：
             * public final AuthenticationInfo getAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
             *         AuthenticationInfo info = this.getCachedAuthenticationInfo(token);
             *         if (info == null) {
             *             info = this.doGetAuthenticationInfo(token);
             *             log.debug("Looked up AuthenticationInfo [{}] from doGetAuthenticationInfo", info);
             *             if (token != null && info != null) {
             *                 this.cacheAuthenticationInfoIfPossible(token, info);
             *             }
             *         } else {
             *             log.debug("Using cached authentication info [{}] to perform credentials matching.", info);
             *         }
             *
             *         if (info != null) {
             *             this.assertCredentialsMatch(token, info);
             *         } else {
             *             log.debug("No AuthenticationInfo found for submitted AuthenticationToken [{}].  Returning null.", token);
             *         }
             *
             *         return info;
             *     }
             *     所以，我们如果想自定义认证，需要自定义Realm类，然后重写doGetAuthenticationInfo方法
             */
            subject.login(token);
            System.out.println("登陆成功");
        }catch (UnknownAccountException ex) {
            ex.printStackTrace();
            System.out.println("用户不存在");
        }catch (IncorrectCredentialsException ex) {
            ex.printStackTrace();
            System.out.println("密码错误");
        }catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("登陆失败");
        }
    }
}
```

此时，就会发现，当我们的用户名密码输入错误的时候，会报对应的异常信息，只有当用户名密码相吻合的时候，会打印输出“登陆成功”

## 授权

### 1、概念

（1）授权，也叫做访问控制，即在应用中控制谁访问哪些资源（如：访问页面/编辑数据/页面操作等等）。在授权中需要了解的几个关键对象：主体（Subject），资源（Resource），权限（Permission），角色（Role）

（2）主体（Subject），访问应用的用户，在Shiro中，Subject就代表用户，用户只有授权，才能允许访问相应的资源

（3）资源（Resource），在应用中用户可以访问的URL，比如：访问页面，查看编辑哪些数据等等

（4）权限（Permission），安全策略中的原子授权单位，通过权限我们可以表示应用中用户有没有操作某个资源的权力，即权限表示在应用中用户能不能访问某个资源。

（5）Shiro支持粗粒度的权限（用户模块的所有权限）以及细粒度的权限（操作某个特定用户的权限）

### 2、授权方式

通常采用注解的方式进行判断：

```java
@RequireRoles("ADMIN")
@GetMapping("/list")
public void test() {
  
}
```

登陆成功以后，可以使用subject对象判断是否具有对应角色和对应权限：
shiro.ini配置文件添加内容：

```xml
[users]
zhangsan=z3,role1,role2
lisi=l4

[roles]
role1=user:insert,user:select
```

```java
//第五步：判断角色
boolean hasRole = subject.hasRole("role1");
System.out.println("是否有role1角色："+hasRole);
//第六步：判断权限
boolean permitted = subject.isPermitted("user:insert");
System.out.println("是否有user:insert权限："+permitted);
```

## shiro加密

实际系统开发中，一些敏感信息需要进行加密处理，比如说用户的密码，在Shiro中内嵌了很多常见的加密算法，比如：MD5加密等等。

举例说明：

```java
public class ShiroMD5 {
    public static void main(String[] args) {
        //密码明文
        String password = "Admin123!!";
        //使用MD5加密
        Md5Hash md5Hash = new Md5Hash(password);
        System.out.println("md5加密 = " + md5Hash);
        //使用MD5加密并加盐
        Md5Hash md5Hash1 = new Md5Hash(password, "feng");
        System.out.println("md5加密并加盐 = " + md5Hash1);
        //多次迭代加密
        Md5Hash md5Hash2 = new Md5Hash(password, "feng", 3);
        System.out.println("md5加密并加盐并多次加密 = " + md5Hash2);
        //使用父类加密
        SimpleHash simpleHash = new SimpleHash("MD5", password, "feng", 3);
        System.out.println("使用父类加密 = " + simpleHash);
    }
}
```

## shiro自定义登陆认证

shiro默认的登陆认证是不携带加密认证的，如果需要实现加密认证，需要自定义Realm

```java
package com.feng.shiro.test;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;

/**
 * @Author: feng
 * @CreateDate: 2024/1/10-15:26
 * @Description:
 */
public class MyShiroRealm extends AuthorizingRealm {
    /**
     * 自定义的登陆认证方法：对接subject.login(token)的认证
     * 需要配置自定义的Realm生效：在ini文件中配置或者springboot中整合配置
     * 该方法只是获取进行对比的数据信息，具体的认证交给shiro去做
     * @param authenticationToken
     * @return
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //1、获取身份信息
        String principal = authenticationToken.getPrincipal().toString();
        //2、获取凭证信息
        String password = new String((char[]) authenticationToken.getCredentials());
        System.out.println("用户认证信息 = " + principal + "----" + password);
        //3、访问数据库，查询存储的用户信息
        if (principal.equals("zhangsan")) {
            //3.1 查询数据库的密码信息
            String passInfo = "8638ad2fc460e22a68033802276b1d51";
            AuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                    authenticationToken.getPrincipal(),
                    passInfo,
                    ByteSource.Util.bytes("feng"),
                    authenticationToken.getPrincipal().toString()
            );
            //4、创建封装校验逻辑的对象，将对象封装返回
            return authenticationInfo;
        }
        return null;

    }


    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }
}

```

# Shiro与SpringBoot整合

## 整合步骤流程

### 第一步：pom.xml添加依赖信息：

```pom
<dependency>
  <groupId>org.apache.shiro</groupId>
  <artifactId>shiro-spring-boot-starter</artifactId>
  <version>1.9.0</version>
</dependency>
```

### 第二步：自定义Realm

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/10-16:05
 * @Description: 自定义Realm
 */
@Component
public class ShiroRealm extends AuthorizingRealm {
    @Resource
    private UserService userService;
    /**
     * 自定义授权方法
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        return null;
    }

    /**
     * 自定义登录认证方法
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //第一步：获取用户的身份信息
        String username = authenticationToken.getPrincipal().toString();
        //第二步：查询对应的用户信息
        User user = userService.selectUserByUserName(username);
        //判断用户是否存在
        if (user == null) {
            throw new AuthenticationException("账号信息不存在");
        }
        //判断账号是否过期
        if(user.getExpireTime() != null && DateUtil.compare(user.getExpireTime(), DateUtil.date()) < 0){
            throw new AuthenticationException("账号已过期");
        }
        //第三步：封装用户对象，将其返回
        AuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                //principal：身份信息
                authenticationToken.getPrincipal(),
                //credentials：凭证信息,即用户密码
                user.getPassword(),
                //盐信息
                ByteSource.Util.bytes(user.getSalt()),
                //身份名称，这里就是用户名称
                authenticationToken.getPrincipal().toString()
        );
        return authenticationInfo;
    }
}
```

### 第三步：Shiro配置类

```java
@Configuration
public class ShiroConfig {
    @Autowired
    private ShiroRealm shiroRealm;

    /**
     * 配置安全管理器
     * @return
     */
    @Bean
    public DefaultWebSecurityManager defaultWebSecurityManager() {
        //1、创建安全管理器
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        //2、创建加密对象，设置相关属性
        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
        //2.1、配置加密算法:SHA-256
        matcher.setHashAlgorithmName(SHA256Utils.HASH_ALGORITHM_NAME);
        //2.2、配置加密次数:15
        matcher.setHashIterations(SHA256Utils.HASH_ITERATIONS);
        //3、将加密对象存储到Realm中
        shiroRealm.setCredentialsMatcher(matcher);
        //4、将Realm存储到安全管理器中
        defaultWebSecurityManager.setRealm(shiroRealm);
        //5、返回安全管理器
        return defaultWebSecurityManager;
    }

    /**
     * 配置Shiro内置过滤器拦截范围
     * @return
     */
    @Bean
    public DefaultShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition definition = new DefaultShiroFilterChainDefinition();
        //配置不会被拦截的链接 顺序判断
        //swagger相关链接
        definition.addPathDefinition("/swagger-ui.html", "anon");
        definition.addPathDefinition("/swagger/**", "anon");
        definition.addPathDefinition("/swagger-resources/**", "anon");
        definition.addPathDefinition("/v2/api-docs/**", "anon");
        definition.addPathDefinition("/webjars/**", "anon");
        definition.addPathDefinition("/doc.html", "anon");
        //静态资源相关链接
        definition.addPathDefinition("/static/**", "anon");
        //登录相关链接
        definition.addPathDefinition("/api/user/login", "anon");
        definition.addPathDefinition("/api/user/register", "anon");
        definition.addPathDefinition("/api/user/logout", "anon");
        //配置需要进行认证的链接
        definition.addPathDefinition("/**", "authc");
        return definition;
    }

    /**
     * 创建ShiroFilterFactoryBean
     */
    @Bean("shiroFilterFactoryBean")
    public ShiroFilterFactoryBean ShiroFilterFactoryBean(DefaultWebSecurityManager securityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        //设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        //添加Shiro内置过滤器
        /**
         * Shiro内置过滤器，可以实现权限相关的拦截器
         *    常用的过滤器：
         *       1、anon: 无需认证（登录）可以访问
         *       2、authc: 必须认证才可以访问
         *       3、user: 如果使用rememberMe的功能可以直接访问
         *       4、perms： 该资源必须得到资源权限才可以访问
         *       5、role: 该资源必须得到角色权限才可以访问
         */
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        //配置过滤:不会被拦截的链接
        //swagger2放行链接
        filterChainDefinitionMap.put("/swagger-ui.html", "anon");
        filterChainDefinitionMap.put("/swagger/**", "anon");
        filterChainDefinitionMap.put("/webjars/**", "anon");
        filterChainDefinitionMap.put("/v2/api-docs", "anon");
        filterChainDefinitionMap.put("/doc.html", "anon");
        filterChainDefinitionMap.put("/swagger-resources", "anon");
        //静态资源放行链接
        filterChainDefinitionMap.put("/static/**", "anon");
        //登陆，注册，退出登陆等
        filterChainDefinitionMap.put("/api/user/login/**", "anon");
        filterChainDefinitionMap.put("/api/user/register/**", "anon");
        filterChainDefinitionMap.put("/api/user/logout/**", "anon");
        //拦截所有请求
        filterChainDefinitionMap.put("/**", "authc");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }
}
```

## 自定义Realm认证策略配置

其中，上方我们只是配置一种Realm认证策略，实际业务场景中可能存在多种认证方式，此时我们就可以配置多个Realm,然后将其配置到我们的DefaultWebSecurityManager管理器中。

## RemeberMe

RememberMe功能常见的场景即为：访问一些网站，关闭了浏览器，下次再打开的时候还能够记住你是谁，直接无需登录即可访问。

基本流程：

1. 首先在登录页面选择remeberMe，然后登录成功后，如果是浏览器登录，则一般会将RemberMe的Cookie写到客户端，然后保存下来
2. 关闭浏览器以后再重新打开，此时发现浏览器还是会记住你的
3. 访问一般的的网页服务端，仍然知道你是谁，且正常访问

开启流程：

首先需要在Shiro配置中添加Remember的开关标识：

```java
//DefaultWebSecurityManager配置RememberMe管理器
defaultWebSecurityManager.setRememberMeManager(rememberMeManager());

//拦截器添加存在rememberMe的用户可以直接访问的链接
filterChainDefinitionMap.put("/**", "user");


/**
     * 创建Cookie对象：用于记住我功能
     * @return
     */
public CookieRememberMeManager rememberMeManager() {
  CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
  cookieRememberMeManager.setCookie(rememberMeCookie());
  return cookieRememberMeManager;
}

/**
     * 创建Cookie对象
     * @return
     */
private SimpleCookie rememberMeCookie() {
  SimpleCookie cookie = new SimpleCookie("rememberMe");
  //配置cookie的过期时间为7天
  cookie.setPath("/");
  cookie.setHttpOnly(true);
  cookie.setMaxAge(7 * 24 * 60 * 60);
  return cookie;
}
```

## 角色权限配置

角色权限配置，我们可以在自定义Realm的对应方法中实现：

```java
package com.feng.zeus.api.security;

import cn.hutool.core.date.DateUtil;
import com.feng.zeus.common.entity.Role;
import com.feng.zeus.common.entity.User;
import com.feng.zeus.core.service.RoleService;
import com.feng.zeus.core.service.UserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.Set;

/**
 * @Author: feng
 * @CreateDate: 2024/1/10-16:05
 * @Description: 自定义Realm
 */
@Component
public class ShiroRealm extends AuthorizingRealm {
    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;
    /**
     * 自定义授权方法
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        //第一步：获取用户的身份信息
        User user = (User) principalCollection.getPrimaryPrincipal();
        //第二步：查询用户的角色信息，配置用户角色
        Set<String> roleSet = new HashSet<>();
        Role userRole = roleService.getUserRoleByRoleId(user.getRoleId());
        roleSet.add(userRole.getValue());
        authorizationInfo.setRoles(roleSet);
        //第三步：查询用户的权限信息，配置用户权限
        Set<String> permissionSet = new HashSet<>();
        authorizationInfo.setStringPermissions(permissionSet);
        return authorizationInfo;
    }
  
		//自定义认证上面已经写过了，这里就直接去掉了
}

```

## 缓存工具使用

缓存工具存在很多，有EhCache，Redis等等，这里主要介绍EhCache，Redis两种对接形式：

### EhCache

EhCache是一种广泛使用的开源java分布式缓存，主要面向通用缓存，JavaEE和轻量级容器等。可以和大部分java项目实现无缝整合。

EhCache支持内存和磁盘存储，默认存储在内存中，如果内存不足，则会将缓存数据同步到磁盘上，EaCahe支持基于Filter的Cache实现，也支持Gzip压缩算法。

EhCache直接在JVM虚拟机中缓存，速度快，效率高

EhCache缺点在于共享麻烦，在分布式集群环境中不方便进行共享操作

### Redis

Redis是主流的缓存工具。

这里我以Redis为例，讲解下具体的配置方式：

#### 第一步：引入对应的依赖包：这里的3.3.1版本和上面的1.9.0的shiro版本相匹配

```xml
<dependency>
  <groupId>org.crazycake</groupId>
  <artifactId>shiro-redis-spring-boot-starter</artifactId>
  <version>3.3.1</version>
</dependency>
```

#### 第二步：在ShiroConfig配置类中添加具体的缓存配置

备注：这里我直接粘贴最终版本的配置类以及所需的类文件：

**ShiroConfig**

```java
@Configuration
public class ShiroConfig {
    /**Shiro-Session缓存超时时间，单位(秒)**/
    private static final int SHIRO_REDIS_SESSION_TIMEOUT = 1800;
    /**Shiro缓存的key前缀**/
    private final String SHIRO_CACHE_KEY = "shiro:cache:";
    /**Shiro-Session缓存前缀**/
    private final String SHIRO_SESSION_KEY = "shiro:session:";
    /**Shiro-Session超时时长，单位(毫秒)**/
    private final long SHIRO_SESSION_TIMEOUT = 1800000L;
    @Resource
    private ShiroRealm shiroRealm;

    /**redis配置**/
    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.port}")
    private int port;
    @Value("${spring.redis.password}")
    private String password;
    @Value("${spring.redis.timeout}")
    private int timeout;

    /**
     * 配置安全管理器
     * @return
     */
    @Bean
    public DefaultWebSecurityManager defaultWebSecurityManager() {
        //1、创建安全管理器
        DefaultWebSecurityManager defaultWebSecurityManager = new DefaultWebSecurityManager();
        //2、创建加密对象，设置相关属性
        HashedCredentialsMatcher matcher = new HashedCredentialsMatcher();
        //2.1、配置加密算法:SHA-256
        matcher.setHashAlgorithmName(SHA256Utils.HASH_ALGORITHM_NAME);
        //2.2、配置加密次数:15
        matcher.setHashIterations(SHA256Utils.HASH_ITERATIONS);
        //3、将加密对象存储到Realm中
        shiroRealm.setCredentialsMatcher(matcher);
        //4、开启缓存机制：允许将用户信息缓存至redis中
        shiroRealm.setAuthenticationCachingEnabled(true);
        //4、将Realm存储到安全管理器中
        defaultWebSecurityManager.setRealm(shiroRealm);
        //5、配置RememberMe管理器
        defaultWebSecurityManager.setRememberMeManager(rememberMeManager());
        //6、配置缓存管理器
        defaultWebSecurityManager.setCacheManager(redisCacheManager());
        //7、配置会话管理器
        defaultWebSecurityManager.setSessionManager(sessionManager());
        //8、返回安全管理器
        return defaultWebSecurityManager;
    }

    /**
     * 配置会话管理器(ShiroSessionManager)
     * 设置sessionDAO、cacheManager、全局session过期时间
     * @return
     */
    private SessionManager sessionManager() {
        // 创建会话管理器(自定义会话管理器)
        ShiroSessionManager sessionManager = new ShiroSessionManager();
        // 设置sessionDAO
        sessionManager.setSessionDAO(redisSessionDAO());
        // 设置缓存管理器
        sessionManager.setCacheManager(redisCacheManager());
        // 设置全局session过期时间
        sessionManager.setGlobalSessionTimeout(SHIRO_SESSION_TIMEOUT);
        // 取消URL后面的JSESSIONID
        sessionManager.setSessionIdUrlRewritingEnabled(false);
        return sessionManager;
    }

    /**
     * 配置缓存管理器：使用Redis
     * 这里的鉴权信息唯一字段名必须为username，不取ID
     * @return
     */
    private CacheManager redisCacheManager() {
        RedisCacheManager redisCacheManager = new RedisCacheManager();
        redisCacheManager.setKeyPrefix(SHIRO_CACHE_KEY);
        redisCacheManager.setRedisManager(redisManager());
        redisCacheManager.setPrincipalIdFieldName("username");
        return redisCacheManager;
    }


    /**
     * 配置Redis管理器
     * 这里这里的host为Redis服务器的"主机名:端口"
     * @return
     */
    private IRedisManager redisManager() {
        RedisManager redisManager = new RedisManager();
        redisManager.setHost(host + ":" + port);
        redisManager.setTimeout(timeout);
        redisManager.setPassword(password);
        return redisManager;
    }


    /**
     * 配置RedisSessionDAO
     */
    @Bean
    public RedisSessionDAO redisSessionDAO() {
        RedisSessionDAO redisSessionDAO = new RedisSessionDAO();
        redisSessionDAO.setRedisManager(redisManager());
        redisSessionDAO.setSessionIdGenerator(new ShiroSessionIdGenerator());
        redisSessionDAO.setKeyPrefix(SHIRO_SESSION_KEY);
        redisSessionDAO.setExpire(SHIRO_REDIS_SESSION_TIMEOUT);
        return redisSessionDAO;
    }

    /**
     * 创建ShiroFilterFactoryBean
     */
    @Bean("shiroFilterFactoryBean")
    public ShiroFilterFactoryBean ShiroFilterFactoryBean(DefaultWebSecurityManager securityManager){
        ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();
        //设置安全管理器
        shiroFilterFactoryBean.setSecurityManager(securityManager);
        //添加Shiro内置过滤器
        /**
         * Shiro内置过滤器，可以实现权限相关的拦截器
         *    常用的过滤器：
         *       1、anon: 无需认证（登录）可以访问
         *       2、authc: 必须认证才可以访问
         *       3、user: 如果使用rememberMe的功能可以直接访问
         *       4、perms： 该资源必须得到资源权限才可以访问
         *       5、role: 该资源必须得到角色权限才可以访问
         *       6、logout: 退出登录
         */

        Map<String, Filter> filters = shiroFilterFactoryBean.getFilters();
        //1、添加自定义的登陆过滤器：用于未登陆时返回json数据
        filters.put("authc", new ShiroLoginFilter());
        //2、添加自定义的登出过滤器，用户登陆时跳转的页面
        ShiroLogoutFilter shiroLogoutFilter = new ShiroLogoutFilter(redisCacheManager());
        shiroLogoutFilter.setRedirectUrl("/api/user/logout/redirect");
        filters.put("logout", shiroLogoutFilter);
        //4、配置拦截过滤URL
        Map<String, String> filterChainDefinitionMap = new LinkedHashMap<>();
        //配置过滤:不会被拦截的链接
        //swagger2放行链接
        filterChainDefinitionMap.put("/swagger-ui.html", "anon");
        filterChainDefinitionMap.put("/swagger/**", "anon");
        filterChainDefinitionMap.put("/webjars/**", "anon");
        filterChainDefinitionMap.put("/v2/api-docs", "anon");
        filterChainDefinitionMap.put("/doc.html", "anon");
        filterChainDefinitionMap.put("/swagger-resources", "anon");
        //静态资源放行链接
        filterChainDefinitionMap.put("/static/**", "anon");
        //登陆，注册，退出登陆等
        filterChainDefinitionMap.put("/api/user/login", "anon");
        filterChainDefinitionMap.put("/api/user/register", "anon");
        filterChainDefinitionMap.put("/api/user/logout/redirect", "anon");
        //设置退出登陆的过滤器
        filterChainDefinitionMap.put("/api/user/logout", "logout");
        //添加存在rememberMe的用户可以直接访问的链接
        filterChainDefinitionMap.put("/**", "user");
        //拦截所有请求
        filterChainDefinitionMap.put("/**", "authc");
        shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
        return shiroFilterFactoryBean;
    }


    /**
     * 创建Cookie对象：用于记住我功能
     * @return
     */
    public CookieRememberMeManager rememberMeManager() {
        CookieRememberMeManager cookieRememberMeManager = new CookieRememberMeManager();
        cookieRememberMeManager.setCookie(rememberMeCookie());
        return cookieRememberMeManager;
    }

    /**
     * 创建Cookie对象
     * @return
     */
    private SimpleCookie rememberMeCookie() {
        SimpleCookie cookie = new SimpleCookie("rememberMe");
        //配置cookie的过期时间为7天
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(7 * 24 * 60 * 60);
        return cookie;
    }

    /**
     * 开启Shiro-aop注解支持
     * @Attention 使用代理方式所以需要开启代码支持
     * @Author fengbin
     * @CreateTime 2024/01/12 8:38
     */
    @Bean
    public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(DefaultWebSecurityManager securityManager) {
        AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();
        authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);
        return authorizationAttributeSourceAdvisor;
    }
}
```

其中，需要的内置的自定义SessionIdGenerator,自定义Session会话管理器，以及自定义ByteSouce类分别如下所示，具体功能在描述中有提及：

**ShiroLoginFilter**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/10-18:33
 * @Description: 自定义Shiro登陆过滤器，修改默认未登陆跳转login.jsp页面的行为
 * 这里自定义配置未登陆返回json数据，前端根据返回code码自行跳转至callback地址
 */
public class ShiroLoginFilter extends UserFilter {
    private static final int UNAUTHORIZED = 401;
    private static final String USER_NOT_LOGIN_MSG = "用户未登录,请先登录~";
    private static final String CALLBACK_ADDRESS = "http://zeus.ft.top";


    /**
     * 未登陆访问认证接口，返回json数据，前端根据返回code码自行跳转至登陆页
     * @param request
     * @param response
     * @throws IOException
     */
    @Override
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        JSONObject redirectJsonObject = new JSONObject();
        redirectJsonObject.put("code", UNAUTHORIZED);
        redirectJsonObject.put("msg", USER_NOT_LOGIN_MSG);
        redirectJsonObject.put("callback", CALLBACK_ADDRESS);
        response.getWriter().write(redirectJsonObject.toJSONString());
    }
}
```

**ShiroLogoutFilter**

```java
package com.feng.zeus.api.security;

import com.feng.zeus.common.exception.BizException;
import com.feng.zeus.common.response.code.BizCode;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.authc.LogoutFilter;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.Serializable;

/**
 * @Author: feng
 * @CreateDate: 2024/3/1-09:29
 * @Description:
 */
public class ShiroLogoutFilter extends LogoutFilter {
    private CacheManager cacheManager;

    public ShiroLogoutFilter(CacheManager cacheManager) {
        this.cacheManager = cacheManager;
    }

    @Override
    protected boolean preHandle(ServletRequest request, ServletResponse response) throws Exception {
        try {
            Subject subject = getSubject(request, response);
            Serializable sessionId = subject.getSession().getId();
            String username = (String) subject.getPrincipal();
            //登出操作
            subject.logout();
            //清除redis的缓存信息（一个是会话token缓存，一个是权限缓存，都需要移除掉）
            //清除会话缓存
            String sessionCacheKey = "shiro:session:";
            Cache<Object, Object> sessionCache = cacheManager.getCache(sessionCacheKey);
            if (sessionCache != null) {
                sessionCache.remove(sessionId);
            }
            //清除权限缓存（没法清除掉）
            String cacheKey = "shiro:cache:com.feng.zeus.api.security.ShiroRealm.authenticationCache:";
            Cache<Object, Object> cache = cacheManager.getCache(cacheKey);
            if (cache != null) {
                cache.remove(username);
            }
        }catch (Exception ex) {
            throw new BizException(BizCode.USER_LOGOUT_ERROR);
        }
        return super.preHandle(request, response);
    }
}
```

**ShiroRealm**

```java
@Component
public class ShiroRealm extends AuthorizingRealm {
    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;
    /**
     * 自定义授权方法
     * @param principalCollection
     * @return
     */
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        //第一步：获取用户的身份信息
        User user = (User) principalCollection.getPrimaryPrincipal();
        //第二步：查询用户的角色信息，配置用户角色
        Set<String> roleSet = new HashSet<>();
        Role userRole = roleService.getUserRoleByRoleId(user.getRoleId());
        roleSet.add(userRole.getValue());
        authorizationInfo.setRoles(roleSet);
        //第三步：查询用户的权限信息，配置用户权限
        Set<String> permissionSet = new HashSet<>();
        authorizationInfo.setStringPermissions(permissionSet);
        return authorizationInfo;
    }

    /**
     * 自定义登录认证方法
     * @param authenticationToken
     * @return
     * @throws AuthenticationException
     */
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken) throws AuthenticationException {
        //第一步：获取用户的身份信息
        String username = authenticationToken.getPrincipal().toString();
        //第二步：查询对应的用户信息
        User user = userService.selectUserByUserName(username);
        //判断用户是否存在
        if (user == null) {
            throw new AuthenticationException("账号信息不存在");
        }
        //判断账号是否过期
        if(user.getExpireTime() != null && DateUtil.compare(user.getExpireTime(), DateUtil.date()) < 0){
            throw new AuthenticationException("账号已过期");
        }
        //第三步：封装用户对象，将其返回
        AuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                //principal：这里存储用户信息，上面可以直接获取：principalCollection.getPrimaryPrincipal()
                user,
                //credentials：凭证信息,即用户密码
                user.getPassword(),
                /**
                 * 这里使用自定义的ByteSource，将盐信息封装到SimpleAuthenticationInfo中
                 * 放弃使用原生的的ByteSource.Util.bytes(user.getSalt()),会导致Redis作为缓存反序列化失败
                 * 注意，方法只能使用new ShiroSimpleByteSource(user.getSalt())
                 * 不能使用new SimpleByteSource(user.getSalt().getBytes())或者SimpleByteSource.Util.bytes(user.getSalt())
                 */
                new ShiroSimpleByteSource(user.getSalt()),
                //身份名称，这里就是用户名称
                authenticationToken.getPrincipal().toString()
        );
        return authenticationInfo;
    }
}

```

**ShiroSessionIdGenerator**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/11-12:33
 * @Description: 自定义SessionId生成器
 */
public class ShiroSessionIdGenerator implements SessionIdGenerator {

    @Override
    public Serializable generateId(Session session) {
        Serializable sessionId = new JavaUuidSessionIdGenerator().generateId(session);
        return String.format("zeus_token_%s", sessionId);
    }
}
```

**ShiroSessionManager**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/11-13:21
 * @Description: 自定义会话管理器，配置从请求头获取token的方式
 */
public class ShiroSessionManager extends DefaultWebSessionManager {
    //定义常量
    private static final String AUTHORIZATION = "Authorization";
    private static final String REFERENCED_SESSION_ID_SOURCE = "Stateless request";

    //重写构造器
    public ShiroSessionManager() {
        super();
        this.setDeleteInvalidSessions(true);
    }

    /**
     * 重写方法实现从请求头获取Token便于接口统一
     * 每次请求进来,Shiro会去从请求头找Authorization这个key对应的Value(Token)
     * @param request
     * @param response
     * @return
     */
    @Override
    public Serializable getSessionId(ServletRequest request, ServletResponse response) {
        //从请求头中获取token
        String token = WebUtils.toHttp(request).getHeader(AUTHORIZATION);
        //如果请求头中存在token 则从请求头中获取token
        if (StrUtil.isNotBlank(token)) {
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE, REFERENCED_SESSION_ID_SOURCE);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID, token);
            request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID, Boolean.TRUE);
            return token;
        } else {
            // 这里禁用掉Cookie获取方式，默认规则从Cookie取Token
            //如果请求头中不存在token 则调用默认从cookie取token方式
            return super.getSessionId(request, response);
        }
    }
}
```

**ShiroSimpleByteSource**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/11-14:33
 * @Description: 自定义ByteSource实现序列化，解决redis缓存序列化报错
 * 整体方法直接仿造SimpleByteSource
 */
public class ShiroSimpleByteSource implements ByteSource, Serializable {

    private static final long serialVersionUID = 1L;

    private  byte[] bytes;
    private String cachedHex;
    private String cachedBase64;

    public ShiroSimpleByteSource() {

    }

    public ShiroSimpleByteSource(byte[] bytes) {
        this.bytes = bytes;
    }

    public ShiroSimpleByteSource(char[] chars) {
        this.bytes = CodecSupport.toBytes(chars);
    }

    public ShiroSimpleByteSource(String string) {
        this.bytes = CodecSupport.toBytes(string);
    }

    public ShiroSimpleByteSource(ByteSource source) {
        this.bytes = source.getBytes();
    }

    public ShiroSimpleByteSource(File file) {
        this.bytes = (new ShiroSimpleByteSource.BytesHelper()).getBytes(file);
    }

    public ShiroSimpleByteSource(InputStream stream) {
        this.bytes = (new ShiroSimpleByteSource.BytesHelper()).getBytes(stream);
    }

    public static boolean isCompatible(Object o) {
        return o instanceof byte[] || o instanceof char[] || o instanceof String || o instanceof ByteSource || o instanceof File || o instanceof InputStream;
    }

    public void setBytes(byte[] bytes) {
        this.bytes = bytes;
    }

    @Override
    public byte[] getBytes() {
        return this.bytes;
    }


    @Override
    public String toHex() {
        if(this.cachedHex == null) {
            this.cachedHex = Hex.encodeToString(this.getBytes());
        }
        return this.cachedHex;
    }

    @Override
    public String toBase64() {
        if(this.cachedBase64 == null) {
            this.cachedBase64 = Base64.encodeToString(this.getBytes());
        }

        return this.cachedBase64;
    }

    @Override
    public boolean isEmpty() {
        return this.bytes == null || this.bytes.length == 0;
    }
    @Override
    public String toString() {
        return this.toBase64();
    }

    @Override
    public int hashCode() {
        return this.bytes != null && this.bytes.length != 0? Arrays.hashCode(this.bytes):0;
    }

    @Override
    public boolean equals(Object o) {
        if(o == this) {
            return true;
        } else if(o instanceof ByteSource) {
            ByteSource bs = (ByteSource)o;
            return Arrays.equals(this.getBytes(), bs.getBytes());
        } else {
            return false;
        }
    }

    private static final class BytesHelper extends CodecSupport {
        private BytesHelper() {
        }

        public byte[] getBytes(File file) {
            return this.toBytes(file);
        }

        public byte[] getBytes(InputStream stream) {
            return this.toBytes(stream);
        }
    }
}
```

使用到的工具类：

**ShiroUtils**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/11-13:14
 * @Description: Shiro工具类
 */
public class ShiroUtils {
    /** 私有构造器 **/
    private ShiroUtils() {}

    public static RedisSessionDAO redisSessionDAO = SpringCtxUtils.getBean(RedisSessionDAO.class);

    /**
     * 获取当前用户的Session
     * @return
     */
    public static Session getSession() {
        return SecurityUtils.getSubject().getSession();
    }

    /**
     * 用户登出
     */
    public static void logout() {
        SecurityUtils.getSubject().logout();
    }

    /**
     * 获取当前用户信息
     * @return
     */
    public static User getUserInfo() {
        return (User) SecurityUtils.getSubject().getPrincipal();
    }

    /**
     * 删除用户缓存信息
     * @param username 用户名称
     * @param isRemoveSession 是否删除Session
     */
    public static void deleteCache(String username, boolean isRemoveSession) {
        Session session = null;
        Collection<Session> activeSessions = redisSessionDAO.getActiveSessions();
        User user;
        Object attribute = null;
        for (Session activeSession : activeSessions) {
            //遍历Session，找到该用户名称对应的Session
            attribute = activeSession.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY);
            if (attribute == null) {
                continue;
            }
            user = (User) ((SimplePrincipalCollection) attribute).getPrimaryPrincipal();
            if (user == null) {
                continue;
            }
            if (Objects.equals(user.getUsername(), username)) {
                session = activeSession;
                break;
            }
        }
        if (session == null || attribute == null) {
            return;
        }
        //删除session
        if (isRemoveSession) {
            redisSessionDAO.delete(session);
        }
    }
}
```

**SHA256Utils**

```java
/**
 * @Author: feng
 * @CreateDate: 2024/1/8-10:27
 * @Description: Sha-256加密工具类
 */
public class SHA256Utils {
    /**私有构造器**/
    private SHA256Utils(){};

    /**加密算法**/
    public static final String HASH_ALGORITHM_NAME = "SHA-256";

    /**加密次数**/
    public static final int HASH_ITERATIONS = 15;

    /**  执行加密-采用SHA256和盐值加密 **/
    public static String sha256(String password, String salt) {
        return new SimpleHash(HASH_ALGORITHM_NAME, password, salt, HASH_ITERATIONS).toString();
    }

}
```

## 会话管理

会话管理器，负责创建和管理用户的会话(Session）生命周期，它能够在任何环境中在本地管理用户会话，即使没有Web/Servlet/EJB容器，也一样可以保存会话。默认情况下，Shiro会检测当前环境中现有的会话机制（比如Servlet容器）进行适配，如果没有(比如独立应用程序或者非web环境），它将会使用内置的企业会话管理器来提供相应的会话管理服务，其中还涉及一个名为SessionDA0的对象。SessionDA0负责Session的持久化操作（CRUD），允许Session数据写入到后端持久化数据库。

### 会话管理实现

SessionSecurityManager接口实现：

(1)  DefaultSessionVanager：用于JavaSE环境
(2) SeryletContainerSessionManager：用于web环境，直接使用Servlet容器的会话
(3) Defaul tWebSessionManager：用于web环境，自己维护会话（不使用Servlet会话管理）

















