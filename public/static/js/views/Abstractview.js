// Class Parent
export default class {

    constructor(params) {
        this.params = params;
        this.origin = location.origin;
    }

    setTitle(title){
        document.title = title;
    }

}