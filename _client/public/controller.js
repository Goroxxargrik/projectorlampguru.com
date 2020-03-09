src="_server\\views\\search.ejs";

app.controller('brandList', ['$scope', '$http', '$timeout' , '$window' ,'$location','$anchorScroll' ,'data', function($scope, $http ,$timeout ,$window, $anchorScroll , $location, data) {
    $scope.key;
    $scope.brandList = [];
    $scope.returnList = [];
    $scope.cartArray = [];
    $scope.brand = 'All lamps';
    $scope.lamp = '';
    $scope.quantity = 1;
    $scope.grandTotal = 0;
    $scope.cartCount = localStorage.length;
    $scope.show = false;
    $scope.showTwo = false;
    $scope.showError = false;
    $scope.resetErrorShow = false;
    $scope.forgotErrorShow = false;
    $scope.registerErrorShow = false;



    
    if(localStorage.getItem('jwt')){
        $scope.loggedIn = true;
        console.log(data.currentUser());
        if(data.currentUser() != null){
            document.getElementById("signedInEmail").innerHTML = data.currentUser();
            console.log($scope.loggedIn);
        }
        

    }
    else{
        $scope.loggedIn = false;


    }

    if(localStorage.getItem('jwt') != null){
    
        $scope.cartCount = localStorage.length - 1;

    }

    if(localStorage.getItem('ignore') != null){

        $scope.cartCount = localStorage.length - 1;

    }



    $scope.createList = function() {


        for(i = 0; i < $window.localStorage.length; i++){

                if(localStorage.getItem(i) == null){
                    i++;
                }
                console.log(i+": "+$window.localStorage.getItem(i));

            
                let item = JSON.parse($window.localStorage.getItem(i));
                console.log(item.cartItem);
                if(item.cartItem == 'ignore'){
                    continue;
                }
                else{
                let tempPrice = item.cartPrice;
                
                $scope.grandTotal += parseFloat(tempPrice);
    
                $scope.cartArray[i] = item;
    
                }
            
            
            
        }
        
        $scope.grandtotal = parseFloat($scope.grandTotal);
        console.log("GRAND TOTAL: $"+ $scope.grandTotal);
    }

    $scope.check = function () { 
        $scope.show = true ? false : true; 
        //$scope.notLoggedIn = true ? true : false; 

    }; 

    //$http.get("/api/lampBrands").success(function (response) {
    //    $scope.brandList = response;
    //});

    // Use the factory/service "data"
    data.getLampBrands().then(function successCallBack(res) {
        $scope.brandList = res.data;
    });

    // Example of a function that does a post with a payload.
    $scope.submit = function () {
        display();
        console.log($scope.brand);
        console.log($scope.lamp);
       
        var payload = {
            brand: $scope.brand,
            lamp: $scope.lamp
        };
        
        
        data.submit(payload).then(function successCallBack(res) {
                $scope.returnList = res.data;
                if(res.data.length > 0){
                    $scope.show = true;
                }
               
                document.getElementById("results").innerHTML = "Results found: "+ $scope.returnList.length;
              
            
        });
        
  
    };

    $scope.addToCart = function (){
        console.log(foundItem);
        console.log(unitPrice);
    
    }

    $scope.transfer = function(index){
        $scope.showTwo = true ? false : true; 
        

        item = $scope.returnList[index].item;
        des = $scope.returnList[index].des;
        price = $scope.returnList[index].price;
        image = $scope.returnList[index].image;

        price=(Math.round(price * 100) / 100).toFixed(2);

        totalPrice = price;

        item = item.replace("+", "%2B");
        console.log(item);
        console.log(des);
        console.log(price);
        console.log(image);

     
        window.location.href = "/search?item="+item;


        


    }

    $scope.testClick = function(quantity, unitPrice){


        $scope.totalPrice = (quantity * unitPrice).toFixed(2);
        document.getElementById("totalCost").innerHTML = '$'+ $scope.totalPrice;

    }

    $scope.purchase = function(quantity){


        
        if(quantity > 0){

     
        totalPrice = (quantity * unitPrice).toFixed(2);

        if(quantity > 1)
        {
        document.getElementById("returnTestID").innerHTML =  " ("+quantity + ") " + foundItem +"'s added to your cart!";

        }
        else{
        document.getElementById("returnTestID").innerHTML =  " ("+quantity + ") " + foundItem +" added to your cart!";

        }


            
        $scope.showTwo = true;
        $scope.key = $window.localStorage.length;

        
        let item = { cartItem: foundItem , cartPrice: totalPrice , cartQuantity: quantity};
        $window.localStorage.setItem($scope.key, JSON.stringify(item));
        let cart = JSON.parse($window.localStorage.getItem($scope.key));
        console.log(cart);
        console.log($scope.key);
        $scope.key++;
        $scope.cartCount += quantity;
        console.log("HOLY COUNT: " + $scope.cartCount);
        
    }
    
}
    
    $scope.checkOut = function(){
        let display = $window.localStorage.getItem(0);
        document.getElementById("cart").innerHTML =  display;
    }

    $scope.finalize = function(){
        console.log(parseFloat($scope.grandTotal));

        if(localStorage.getItem('jwt') == null){
            localStorage.clear();
            window.location.href = "/complete.html";


        }

        else if(localStorage.getItem('jwt').length > 0){
            let myObj = JSON.parse(localStorage.getItem('jwt'));
            localStorage.clear();
            $window.localStorage.setItem("jwt", JSON.stringify(myObj));            
            window.location.href = "/complete.html";

        }
        
        


      

    }

    $scope.disableLoginButton = function(email,password){
        if(email == "" || password == ""){
            return false;
        }
        if(email == null || password == null){
            return false;
        }
        else{
            return true;
        }
    }
    

    $scope.disableRegisterButton  = function(email,password,billTo,phone,contName, confirm){
        if(email == "" || password == "" || billTo == "" || phone == "" || contName == "" || confirm == ""){
            return false;
        }
        if(email == null || password == null || billTo == null || phone == null || contName == null || confirm == null){
            return false;
        }
        else{
            return true;
        }
    }


    $scope.disableForgotButton  = function(email){
        if(email == "" ){
            return false;
        }
        if(email == null){
            return false;
        }
        else{
            return true;
        }
    }


    $scope.disableResetButton  = function(token,password,confPassword){
        if(token == "" || password == "" || confPassword == ""){
            return false;
        }
        if(token == null || password == null || confPassword == null){
            return false;
        }
        else{
            return true;
        }
    }



    $scope.sendToken = function(email){

        var payload = ({
            userEmail: email
           
        });

        data.sendToken(payload).then(function successCallBack(res) {

            if(res.data.message == "no_email"){
                document.getElementById("forgotErrorShow").innerHTML = "This email does not exist";
                $scope.forgotErrorShow = true;
            }
            else{
                window.location.href = "/reset.html";

            }
            
        });
    }


    $scope.resetPassword = function(token, password, confPassword){
        
        var payload = ({

            token : token,
            hash : password,
            confHash : confPassword

        })

        data.resetPassword(payload).then(function successCallBack(res) {

            console.log(res.data.message);

            if(res.data.message == "no_salt"){

                document.getElementById("resetErrorShow").innerHTML = "This token does not exist";
                $scope.resetErrorShow = true;

            }
            else if(res.data.message == "no_cap"){

                document.getElementById("resetErrorShow").innerHTML = "Password must use at least one capital letter";
                $scope.resetErrorShow = true;

            }
            else if(res.data.message == "no_match"){

                document.getElementById("resetErrorShow").innerHTML = "Passwords do not match";
                $scope.resetErrorShow = true;

            }
            else{
                window.location.href = "/login.html";
            }
            
        });

    }


    
    $scope.remove = function(index){
      

        let decrease = JSON.parse(localStorage.getItem(index));
        let myObj = { cartItem: 'ignore', cartPrice: 'ignore', cartQuantity: 'ignore' };
        $window.localStorage.setItem(index, JSON.stringify(myObj));     


       window.location.href = "/cart.html";


    }


    $scope.userLogin = function(email,password){
        console.log(email);

        var payload = ({
            userEmail: email,
            userPass: password
           
        });



        data.userLogin(payload).then(function successCallBack(res) {
            let myObj = { userProperty: res.data};
            $window.localStorage.setItem("jwt", JSON.stringify(myObj)); 
            $scope.loggedIn = true;
            window.location.href = "/slg.html";




        
    }, function errorCallback(res){
        console.log("I HAVE HAD IT WITH THIS MOTHA TRUCKIN SNAKES ON THIS MOTHA TRUCKIN PLANE");
        console.log(res.status);

        if(res.status == 406){
            console.log("Please enter information is both fields");
            document.getElementById("loginError").innerHTML = "Please enter information is both fields";
            $scope.showError = true;


        }

        else if(res.status == 403){
            console.log("This email has not yet been registered");
            document.getElementById("loginError").innerHTML = "This email has not yet been registered";
            $scope.showError = true;

        }
        else if(res.status == 400){
            console.log("The email and password combination is not correct");
            document.getElementById("loginError").innerHTML = "The email and password combination is incorrect";
            $scope.showError = true;


        }
        
    });

    
       
        
}
    $scope.userLogout = function(){
        localStorage.removeItem('jwt');
        window.location.href = "/";


    }
    
    $scope.userRegister = function(email,password,billTo,phone,contName, confirm){

        var payload = ({
            userEmail: email,
            userPass: password,
            userConf: confirm,
            userBillTo: billTo,
            userPhone: phone,
            userContName: contName
           
        });


        data.userRegister(payload).then(function successCallBack(res) {
            console.log(res.data.message);
            if(res.data.message == "no_reuse"){
                document.getElementById("registerErrorShow").innerHTML = "Email already registered";
                console.log("BINGBONG");
                $scope.registerErrorShow = true;
            }
            
            else if(res.data.message == "no_valid"){
                document.getElementById("registerErrorShow").innerHTML = "Not a valid email address";
                $scope.registerErrorShow = true;
            }

            else if(res.data.message == "no_cap"){
                document.getElementById("registerErrorShow").innerHTML = "Password must contain at least 1 capital letter";
                $scope.registerErrorShow = true;
            }

            else if(res.data.message == "no_match"){
                document.getElementById("registerErrorShow").innerHTML = "Passwords do not match";
                $scope.registerErrorShow = true;
            }

            else{
                window.location.href = "/login.html";
            }
        
    });

    }    


}]);





function display() {
  var lamp = document.getElementById("selBrand").value;
  document.getElementById("retBrand").innerHTML = lamp;


}

function addProduct(){
    let products = [];
    if($window.localStorage.getItem('products')){
        products = JSON.parse($window.localStorage.getItem('products'));
    }
    products.push({'productId' : productId + 1, image : '<imageLink>'});
    $window.localStorage.setItem('products', JSON.stringify(products));
}



