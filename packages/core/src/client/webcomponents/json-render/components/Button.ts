import type { VNode } from 'vue'
import type { RegistryComponentProps } from './types'
import { useActions } from '@json-render/vue'
import { computed, defineComponent, h } from 'vue'
import { colors, primary, surfaceSubtle } from './tokens'
import { useIconSvg } from './types'

export const Button = defineComponent({
  name: 'JrButton',
  props: ['element', 'emit', 'on', 'bindings', 'loading'],
  setup(ctx: RegistryComponentProps) {
    const iconSvg = useIconSvg(() => ctx.element.props.icon)
    const actions = useActions()

    const isLoading = computed(() => {
      if (ctx.loading)
        return true
      const binding = ctx.element.on?.press
      if (!binding)
        return false
      const list = Array.isArray(binding) ? binding : [binding]
      return list.some(b => actions.loadingActions.has(b.action))
    })

    return () => {
      const { label, icon, variant = 'secondary', disabled } = ctx.element.props
      const press = ctx.on('press')
      const loading = isLoading.value
      const isDisabled = !!disabled || loading
      const styles: Record<string, Record<string, string>> = {
        primary: { backgroundColor: primary, color: '#fff' },
        secondary: { backgroundColor: surfaceSubtle, color: 'inherit' },
        ghost: { backgroundColor: 'transparent', color: 'inherit' },
        danger: { backgroundColor: colors.error.bg, color: colors.error.fg },
      }
      const children: (VNode | string)[] = []
      if (loading) {
        children.push(h('span', {
          class: 'i-ph-circle-notch animate-spin',
          style: { display: 'inline-flex', width: '14px', height: '14px' },
        }))
      }
      else if (icon && iconSvg.value) {
        children.push(h('span', {
          style: { display: 'inline-flex', width: '14px', height: '14px' },
          innerHTML: iconSvg.value,
        }))
      }
      if (label)
        children.push(label)

      return h('button', {
        class: `jr-button jr-button-${variant}`,
        disabled: isDisabled,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 12px',
          borderRadius: '4px',
          border: 'none',
          fontSize: '12px',
          fontWeight: '500',
          cursor: loading ? 'wait' : isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? '0.5' : '1',
          whiteSpace: 'nowrap',
          ...styles[variant],
        },
        onClick: () => press.emit(),
      }, children)
    }
  },
})
