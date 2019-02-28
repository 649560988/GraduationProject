import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'antd'
import styled from 'styled-components'
import styles2 from '../routes/TSApplication/TS.less'
import { styles } from '../common/menu';

const Wrapper = styled.div`
  background-color: '#F5F5F5';
  display: flex;
  flex: 1;
  flex-direction: column;
`

const Header = styled(Card)`
  margin-bottom: 10px;
  padding-left: -10px;
  height: 62px;
  min-height: 62px;
`

const TitleBar = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

const Title = styled.div`
  font-weight: 400;
  margin-right: 20px;
  line-height: 25px;
  color: #000;
  font-size: 18px;
`

const HeaderInner = styled.div`
  display: flex;
  height: 32px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const Body = styled.div`
  padding: 10px;
  flex: 1;
  display: flex;
`

const NormalBody = styled.div`
  flex: 1;
  overflow: auto;
`

const CardHeader = styled.div`

  &:after {
    display: block;
    content: ' ';
    margin-left: -20px;
    margin-right: -20px;
    height: 0;
    border-bottom: 1px solid #e8e8e8;
  }
`

class TableLayout extends React.Component {
  static CardHeader = CardHeader

  static propTypes = {
    // 标题
    title: PropTypes.string.isRequired,
    // 是否显示返回按钮
    showBackBtn: PropTypes.bool,
    // 点击返回按钮事件
    onBackBtnClick: PropTypes.func,
    // 渲染标题旁边的按钮
    renderTitleSide: PropTypes.func,
    // 渲染Header右侧的内容
    renderHeaderSide: PropTypes.func,
    // 是否将body作为card渲染, 默认为true, 如果需要对body区域自定义布局，改成false
    wrapBodyWithCard: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    showBackBtn: false,
    onBackBtnClick: () => { },
    renderHeaderSide: () => null,
    renderTitleSide: () => null,
    wrapBodyWithCard: true
  }

  render () {
    return (
      <Wrapper>
        <Header bodyStyle={{ padding: '15px' }}>
          <HeaderInner>
            <TitleBar className={styles2.titleBar}>
              {this.props.showBackBtn
                ? <Icon onClick={this.props.onBackBtnClick} type='arrow-left' style={{ cursor: 'pointer', marginRight: 10, fontSize: 22, color: 'rgb(33, 150, 243)' }} />
                : null}
              <Title >{this.props.title}</Title>
              {this.props.renderTitleSide({})}
            </TitleBar>
            <div>
              {this.props.renderHeaderSide({})}
            </div>
          </HeaderInner>
        </Header>
        <Body>
          {this.props.wrapBodyWithCard
            ? <Card style={{ flex: 1, overflow: 'auto' }} bodyStyle={{ padding: 20 }}>{this.props.children}</Card>
            : <NormalBody>{this.props.children}</NormalBody>
          }
        </Body>
      </Wrapper>
    )
  }
}

export default TableLayout
