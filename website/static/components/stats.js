const stats = Vue.component("stats", {
    template: `
    <div>

        <div v-if=" msg1 == 'Got Graph 1' && msg2 == 'Got Graph 2' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none; padding: 30px;">
            <img :src="image_path_1" alt="" style="width: 750px; height: 500px; margin-bottom: 100px">
            <p>
            <img :src="image_path_2" alt="" style="width: 650px;height: 500px">
        </div>

        <div v-if="msg1 == 'Got Graph 1' && msg2 == 'No Graph 2 to Preview' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none; padding: 30px;">
            <img :src="image_path_1" alt="" style="width: 750px; height: 500px; margin-bottom: 100px">
        </div>

        <div v-if=" msg1 == 'No Graph 1 to Preview' && msg2 == 'Got Graph 2' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none; padding: 30px;">
            <img :src="image_path_2" alt="" style="width: 650px;height: 500px">
        </div>

        <div v-if=" msg1 == 'No Graph 1 to Preview' && msg2 == 'No Graph 2 to Preview' " style="height: 550px; width: 1230px; border-bottom-right-radius: 50px; border-bottom-left-radius: 50px;  overflow: auto; scrollbar-width: none; padding: 30px;">
            <h3 align="center" style="margin-top: 200px; color: #757575;"> No Graphs to preview right now. </h3>
        </div>

    </div>`,

    data() {
        return{
            image_path_1: "/static/graph1.jpeg",
            image_path_2: "/static/borrowing_activity.png",
            refresh_count: 0,
            msg1: "",
            msg2: ""
        }
    },
    methods: {
        getstats(){
            const token = localStorage.getItem("auth-token");
            fetch(`http://127.0.0.1:5000/stats`,{
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
                this.msg1 = data.msg_graph_1
                this.msg2 = data.msg_graph_2
            })
        } 
    },   
    mounted(){
        this.getstats();
    },       
    
});

export default stats;