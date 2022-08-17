document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        cartMenu: false,
        openMenu: true,
        closeMenu: false,

        ClearingCart(){
                  setTimeout(() => {
                      this.Rest();
                  }, 5000);
              },

        Rest() {
                  
          this.cartMenu = false;
          this.openMenu = true;
          this.closeMenu = false;
          this.message ="";
          this.username = '';
          this.cartId ='';
          this.cart  = { total : 0};
          this.totalAmount ='0';
          this.payAmount ='';
              },   


        init(){

            axios
            .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
            .then((result) => {
                    this.pizzas = result.data.pizzas;
                    this.smallpizza = this.pizzas['11'];
                    this.mediumpizza = this.pizzas['7'];
                    this.largepizza = this.pizzas['22'];
                    // console.log(this.largepizza)
        })
             .then(() => {
              return this.createCart();
             })
             .then((result) => {
              this.cartId = result.data.cart_code;
             })
        },


        createCart() {
         return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
        },

        showCart() {
          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

          axios
          .get(url)
          .then((result) => {
            this.cart =result.data;
            this.totalAmount = this.cart.total,toFix(2);
            // console.log(this.totalAmount);
          })
        },

        payment() {
          if (this.payAmount > this.totalAmount) {
           
            axios

             .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', this.cartId)
             .then(() => {
              this.message = "Pizza in the cart paid"
              this.showCart();
             })
            } else {

              axios
              .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', this.cartId)
              .then(() => {
               this.message = "Cart payment failed"
               this.showCart();
              })
            }
          },

        pizzaImage(pizza) {
          return `picture/${pizza.size}.jpg`
        },

        message:"",
        pizzas: [],
        smallpizza: [],
        mediumpizza: [],
        largepizza: [],
        username:'',
        cartId:'',
        cart : { total : 0},
        totalAmount:'0',
        payAmount:'',
        
        add(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id,
          }

          axios
               .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
               .then(() => {
                // this.message = "Pizza added to the cart"
                this.showCart();
               })
               .catch(err => alert(err) );
        },

        remove(pizza) {
          const params = {
            cart_code: this.cartId,
            pizza_id: pizza.id,
          }

          axios
               .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
               .then(() => {
                // this.message = "Pizza removed to the cart"
                this.showCart();
               })
               .catch(err => alert(err) );
        },

      }
    })
})
