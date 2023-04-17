const Auth = (req, res, next) => {
if(req.headers.authorization !== 'Admin'){
    return res.status(401).send({
        isError: true, 
        message: 'User Unauthorized',
        data: null
    })
  }
    next()
}

module.exports = Auth // {} --> Untuk export name, sedangkan tanpa {} --> export fungsion