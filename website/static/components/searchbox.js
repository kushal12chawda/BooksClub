const searchbox = Vue.component("searchbox", {
    template: `
    <div> 
        <div class="search-box" align="center" style="padding: 20px; border-color: #3C2113">
        <form @submit.prevent>
            <input v-model="item" type="text"  placeholder="    Search..." style="padding: 10px; width: 60%; border-radius: 10px; border: 1px solid #ccc; margin-top: 20px; background-color: #F6F6F4;">
            <button type="button" class="btn"  @click="clearSearch"  style="margin-left: -63px ; background: none; border: none; cursor: pointer; color:#757575; height: 43px; box-shadow: none">
                <i class='bx bx-x' style="color: #757575; font-size: 30px;"></i>
            </button>
        </form>
        </div>
    </div>`,

    data(){
        return{
            item: localStorage.getItem('userSearchQuery') || '',
            prevPath: null,
        }
    },

    mounted() {
        this.prevPath = localStorage.getItem('userSearchPrevPath') || this.$route.path;
    },

    watch: {
        '$route'(to, from) {
            if (!to.path.startsWith('/search/')) {
                this.prevPath = to.path;
                localStorage.setItem('userSearchPrevPath', to.path); 
            }
        },
        'item'(newVal) {
            const trimmedItem = newVal.trim();
            if (trimmedItem) {
                localStorage.setItem('userSearchQuery', trimmedItem); 
                this.$router.push(`/search/${trimmedItem}`); 
            } else {
                localStorage.removeItem('userSearchQuery'); 
                this.$router.push(this.prevPath); 
            }
        }
    },

    methods: {
        clearSearch() {
          this.item = "";
        },
    },

});

export default searchbox;