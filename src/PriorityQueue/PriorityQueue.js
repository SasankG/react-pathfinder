import Node from "./PNode";

export default class PQueue{

    constructor(){

        // define the array that will hold all nodes
        //  - intialize an empty array with null
        //  - we do not need to declare the currentSize and capacity as variables
        //      - the currentSize can be gotten by heap.length
        this.heap = [];

    }

    // Define all priority queue functions
    //  - insert / enqueue function
    //  - because this is a simple priority queue and not a min heap
    //      - we can simply use a for loop to parse through the queue and insert our node at the correct position
    insert(value, priority){

        // create a new node
        const temp = new Node(value, priority);

        // check if the queue is empty
        //  - if it is, simply push the node
        if(this.isEmpty()){
            this.heap.push(temp);
        }

        // other wise run a for loop through the queue and add the node
        //  - we will first create a bool that we will use to double check if we added our node by the end of the for loop
        let contains = false;
    
        //  - run a for loop through the queue
        for(let i = 0; i < this.heap.length; i++){

            // check if the current node priority is > temp
            if(temp.priority < this.heap[i].priority){

                // splice the node into the queue
                this.heap.splice(i,0,temp);

                // check contains to true
                //  - indicating that the node has been added
                contains = true;

                // break once we have added the node
                break;

            }

        }

        // check if the node has been added or not
        //  - if it has not, simply push the node to the queue
        if(!contains){
            this.heap.push(temp);
        }

    };

    // - Remove Function
    //  - this is a simple function that removes the item at the front of the queue
    //  - it is similar to getMin()
    remove(){

        let min = this.heap.shift();

        return min;

    }


    // - Is Empty Function
    //  - this function simply checks if the heap is empty
    isEmpty(){
        return(this.heap.length === 0)
    };


}