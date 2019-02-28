import React from 'react'
import TableLayout from '../../layouts/TableLayout';
import { Form } from 'antd';

class TSApprovalEdit extends React.Component {

    render () {
        return (
            <TableLayout>
                TS申请列表
            </TableLayout>
        )
    }
}

export default Form.create()(TSApprovalEdit)