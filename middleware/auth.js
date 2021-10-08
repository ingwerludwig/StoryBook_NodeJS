module.exports = {
    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){ //method dari passport js, dengan mengembalikan true / false
            return next() //jika berhasil, jalnakan middleware selanjutnya lihat di auth.js di routes
        }else{
            res.redirect('/') //jika gagal, kembali ke halaman awal
        }
    },
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard') //jika ia sudah terlogin, maka kembalikan ke dashboard
        }else{
            return next() 
        }
    }
}