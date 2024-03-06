
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default function createComponent() {
  const plugin = [];
  plugin.push(Components({
    resolvers: [
      ElementPlusResolver({
        // 关键：自动引入修改主题色添加这一行，使用预处理样式
        importStyle: 'sass'
      })
    ]
  }))
  return plugin
}
