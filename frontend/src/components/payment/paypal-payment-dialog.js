import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'

class PaypalPaymentDialog extends Component {
  componentWillMount () { }

  handleNewOrder = (e) => {
    e.preventDefault()
    this.props.createOrder({
      provider: 'paypal',
      currency: 'USD',
      amount: this.props.itemPrice,
      userId: this.props.user.id,
      TaskId: this.props.task
    })
  }

  triggerPayment (order) {
    window.location.href = order.payment_url
  }

  render () {
    return (
      <Dialog
        open={ this.props.open }
        onClose={ this.props.onClose }
        aria-labelledby='alert-dialog-payment-title'
        aria-describedby='alert-dialog-payment-description'
        fullWidth
        maxWidth='md'
      >
        <DialogTitle id='alert-dialog-payment-title'>
          Realizar pagamento com o Paypal
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-payment-description'>
            Lembre-se que quem for trabalhar nesta tarefa terá que receber o pagamento também pelo Paypal.
          </DialogContentText>
          { this.props.order.data.payment_url ? (
            this.triggerPayment(this.props.order.data)
          ) : (
            <div style={ { textAlign: 'center', width: '100%', marginTop: 40, fontFamily: 'Roboto' } }>
              Pagar com <br />
              <a href='#' title='Realizar pagamento com o Paypal' onClick={ this.handleNewOrder }>
                <img src='https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg' border='0' alt='PayPal Logo' />
              </a>
            </div>
          ) }
        </DialogContent>
      </Dialog>
    )
  }
}

PaypalPaymentDialog.propTypes = {
  task: PropTypes.string,
  open: PropTypes.bool,
  user: PropTypes.object.isRequired,
  createOrder: PropTypes.func,
  onClose: PropTypes.func,
  order: PropTypes.object.isRequired,
  itemPrice: PropTypes.any
}

export default PaypalPaymentDialog
