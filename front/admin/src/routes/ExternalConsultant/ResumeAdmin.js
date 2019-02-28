import React from 'react'
import Resume from '../../components/Resume'
import { connect } from 'dva'

/**
 * 仅在前台使用
 */
@connect(({user}) => ({
  currentUser: user.currentUser,
  permissions: user.currentUser.permissions
}))
class PersonalCenter extends React.Component {
  render () {
    return !this.props.match.params.resumeId ? null
      : <div style={{ margin: '0 auto', maxWidth: 1120 }}>
        <Resume
          server={process.env.server}
          showBackbutton
          enableEvaluation
          editable={this.props.permissions.includes('baseinfo-service.ocms-resume.update')}
          resumeId={this.props.match.params.resumeId}
        />
      </div>
  }
}

export default PersonalCenter
