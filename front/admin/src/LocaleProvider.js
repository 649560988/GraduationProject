import React from 'react'
import { connect } from 'dva'
import { LocaleProvider as AntLocaleProvider } from 'antd'
import { IntlProvider } from 'react-intl'
import zhCN from 'antd/lib/locale-provider/zh_CN'

@connect(({locale}) => ({
  locale
}))
export class LocaleProvider extends React.Component {
  componentDidMount () {
    this.props.dispatch({ type: 'locale/fetchCurrent' })
  }

  getAntLocale (locale) {
    if (locale === 'zh_cn') return zhCN
    return zhCN
  }

  render () {
    const { locale } = this.props
    return (
      <AntLocaleProvider locale={this.getAntLocale(locale.current)}>
        <IntlProvider locale={locale.current} messages={locale.messages}>
          {this.props.children}
        </IntlProvider>
      </AntLocaleProvider>
    )
  }
}
