const admin_stats = Vue.component("admin_stats", {
    template: `
    <div> 

        <div v-if=" msg1 == 'Got Graph 1' && msg2 == 'Got Graph 2' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
            <img :src="image_path_3" alt="" style="width: 650px; height: 500px; margin-top: 50px">
            <p>
            <img :src="image_path_4" alt="" style="width: 650px; height: 500px; margin-top: 100px">
        </div>

        <div v-if=" msg1 == 'Got Graph 1' && msg2 == 'No Graph 2 to Preview' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
            <img :src="image_path_3" alt="" style="width: 650px; height: 500px; margin-top: 50px">
            <p>
            <h3 align="center" style="margin-top: 80px; margin-bottom: 100px; color: #757575;"> Graph 'Distribution of Books Borrowed by Category' can't be previewed right now. </h3>
        </div>

        <div v-if=" msg1 == 'No Graph 1 to Preview' && msg2 == 'Got Graph 2' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
            <h3 align="center" style="margin-bottom: 100px; color: #757575;"> Graph 'Total Number of Books Issued Each Month' can't be previewed right now. </h3>
            <p>
            <img :src="image_path_4" alt="" style="width: 650px; height: 500px; margin-top: 100px">
        </div>

        <div v-if=" msg1 == 'No Graph 1 to Preview' && msg2 == 'No Graph 2 to Preview' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none;">
            <h3 align="center" style="margin-top: 200px; color: #757575;"> No Graphs to preview right now. </h3>
        </div>

    </div>`,

    data() {
        return{
            image_path_3: "/static/graph3.jpeg",
            image_path_4: "/static/graph4.jpeg",
            refresh_count: 0,
            msg1: "",
            msg2: ""
        }
    },
    methods: {
        getAdminStats(){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/admin_stats`,{
                method: 'GET',
                headers: {
                    'Content-Type':'application/json',
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
                        localStorage.removeItem('firstLogin');
                        localStorage.removeItem('activeLink');
                        localStorage.removeItem('adminSearchPrevPath');
                        localStorage.removeItem('adminSearchQuery');
                        this.$router.push('/');
                        this.$router.go()
                    }, 1000);
                }
            })
            .then((data) => {
                this.msg1 = data.msg_graph_1
                this.msg2 = data.msg_graph_2
            })
        } 
    },   
    mounted(){
        this.getAdminStats();
    },
});

export default admin_stats;