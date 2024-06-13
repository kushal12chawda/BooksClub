const cat = Vue.component("cat", {
    template: `
    <div> 
        <div align="left" style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none">
        <table>
        <tbody>
            <tr v-for="(value, key) in count" :key="key">
                <td style="padding-left: 40px; padding-top: 20px; font-size: 30px; font-weight: bolder; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;">{{ key }}
                <tr>
                    <td v-for="(i) in value" style="padding: 20px;">
                        <router-link :to="/book/+i[0]">
                        <div style="position: relative;">
                            <div style="position: absolute; top:0; left:0; z-index: 9;height: 150px; width: 130px; background: linear-gradient(to bottom, #43c6ac, #191654); text-align: center; padding-top: 60px; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px;">
                                <h4><p style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; text-decoration: none; text-decoration-skip-ink: none;">{{ i[1] }}</p></h4>
                            </div>
                            <div style="position: relative; top: 8px; left: 8px; height: 150px; width: 130px; background-color: #24243e; border-radius: 5px; border-top-right-radius: 25px; border-bottom-right-radius: 25px"></div>
                        </div>
                        </router-link>
                    </td>
                </tr>
                </td>
            </tr>
        </tbody>
        </table>
        </div>
    </div>`,

    data() {
        return {
          categorydata: [],
          categoryBooks: {}
        };
      },
    
    methods: {
        fetchCategory() {
            const token = localStorage.getItem("auth-token");
            fetch("http://127.0.0.1:5000/api/category",{
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
              },
            })
            .then(response =>{
                if(response.status===200){
                    return response.json();
                }
                else if (response.status === 401 || response.status === 422){
                    alert("Access unauthorized. Please log in to continue.");
                    setTimeout(() => {
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('firstLogin1');
                        localStorage.removeItem('activeLink1');
                        localStorage.removeItem('userSearchPrevPath');
                        localStorage.removeItem('userSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then((data) => {
                this.categorydata = data
            }); 
        },
      },
    
    computed: {
        count() {
            for (let i=0; i<this.categorydata.length; i++){
              let a = this.categorydata[i]
              let cat_name = a.category_name
              let cat_book = a.book_name
              this.categoryBooks[cat_name]= cat_book
            }
          return this.categoryBooks;
        }
      },
    
    mounted() {
        this.fetchCategory();
      }
})

export default cat;