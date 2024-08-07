// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Studydoc Platform',
  tagline: '持续总结ing，持续学习ing',
  favicon: 'img/cover/icon.svg',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/study-doc/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://gitee.com/fbelite/study-platform/blob/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      //文档开启默认展开
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      navbar: {
        title: '学习笔记平台',
        logo: {
          alt: 'My Site Logo',
          src: 'img/cover/icon.svg',
        },
        //配置顶部导航栏
        items: [
            /*文档区域配置*/
            //算法顶部导航栏
            {
              type: 'doc',
              docId: 'algorithm/leetcode/hot100_1', //文档id
              position: 'left',
              label: '算法',
            },
            {
              type: 'doc',
              docId: 'backend/java/JDK8_CompletableFuture', //文档id
              position: 'left',
              label: '后端',
            },
            {
              type: 'doc',
              docId: 'frontend/review/review', //文档id
              position: 'left',
              label: '前端',
            },
            {
              type: 'doc',
              docId: 'computer_network/cn', //文档id
              position: 'left',
              label: '计算机网络',
            },
            {
              type: 'doc',
              docId: 'design_pattern/dp_review', //文档id
              position: 'left',
              label: '设计模式',
            },
            {
              type: 'doc',
              docId: 'mac/Mac01', //文档id
              position: 'left',
              label: 'Mac',
            }

        ],
      },
      //底部栏
      footer: {
        style: 'light',
        links: [
          {
            title: 'Algorithm Website',
            items: [
              {
                label: 'LeetCode',
                to: 'https://leetcode.cn/problemset/all/',
              },
              {
                label: 'CodeTop',
                to: 'https://codetop.cc/home',
              },
            ],
          },
          {
            title: 'Knowledge Website',
            items: [
              {
                label: '牛客网',
                to: 'https://www.nowcoder.com/',
              },
              {
                label: 'CSDN',
                to: 'https://www.csdn.net/',
              },
              {
                label: 'Stack Overflow',
                to: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: '布洛格博客',
                to: 'https://tfblog.top',
              },
              {
                label: 'GitHub',
                to: 'https://github.com/facebook/docusaurus',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Studydoc Platform, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
