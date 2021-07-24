var budgetController = (function() {
    var Income = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
    };
    
    var Expense = function(id, description, value){
        this.id = id
        this.description = description
        this.value = value
        this.percentage = -1
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome ) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    var data = {
        items : {
            inc : [],
            exp : []
        },
        
        totals : {
            inc : 0,
            exp : 0
        },
        budget : 0
    };

    var calculateTotal = function(type){
        // calculate total income and expenses
        var sum = 0;
        data.items[type].forEach(function(curr){
            sum += curr.value;
            
        })
        data.totals[type] = sum;
        // console.log(curr.value, sum);
    };
        

        
    // creating items
    return {
        addItems : function(type, des, val){
            var newItem, ID;
            console.log(data.items[type]);
            if (data.items[type].length > 0) {
                ID = data.items[type][data.items[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            
            if (type === 'inc') {
                newItem = new Income(ID, des, val);
                data.items[type].push(newItem)
                return newItem;

            } else if (type === 'exp') {
                newItem = new Expense(ID, des, val);
                data.items[type].push(newItem)
                return newItem;
                }
            
            },
        
        deleteItems : function(type, id) {
            var idArray, idIndex;
            // forms an array of ids of input elements.
            idArray = data.items[type].map(function(current) {
                return current.id;
            });
            // gives the index of the id from the new array
            idIndex = idArray.indexOf(id);

            // if index exists deletes the item from the array
            if (idIndex !== -1) {
                data.items[type].splice(idIndex, 1);
            }
            
        },
        
        calculateBudget : function(){
            calculateTotal('inc');
            calculateTotal('exp');

            // calculatw budget ie income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            console.log(data.budget);
             // calculate expenses percentage
             if ( data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
             } else { 
                 data.percentage = -1;
             }
             console.log(data.percentage);
        },
        
        getBudget : function(){
            return {
            budget : data.budget,
            totalIncome : data.totals.inc,
            totalExpenses : data.totals.exp,
            percentage : data.percentage,
            };
            
        },

        calcPercentageArray : function() {
            data.items.exp.forEach(function(current) {
                return current.calcPercentage(data.totals.inc)
            })
        },

        getPercentageArray : function() {
            var percentArray = data.items.exp.map(function(current) {
                return current.getPercentage();
            })
            return percentArray;
        },
        
        testing : function(){
            console.log(data);
        }
    }
})();

var UIController = (function(){
    return {
        inputItems : function(){
            return {
                type : document.querySelector('.add__type').value,
                description : document.querySelector('.add__description').value,
                value : parseFloat(document.querySelector('.add__value').value),
            }

        },
        addListItem : function (obj, type) {
            var html, newHtml, element;
            if (type === 'inc') {
                element = '.income__list';
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                console.log("income");
            } else if (type === 'exp') {
                element = '.expenses__list';
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                console.log("Expense");
            }
        
            newHtml = html.replace('%id%', obj.id );
            newHtml = newHtml.replace('%description%', obj.description);
            // console.log(obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
    
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem : function (selectorID) {
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el)
        },
        displayBudget : function(obj){
            document.querySelector('.budget__value').textContent = obj.budget;
            document.querySelector(".budget__income--value").textContent = obj.totalIncome;
            document.querySelector(".budget__expenses--value").textContent = obj.totalExpenses;

            if (obj.percentage > 0){
                document.querySelector(".budget__expenses--percentage").textContent = obj.percentage + '%';
            } else {
                document.querySelector(".budget__expenses--percentage").textContent = '---';
            }
            
        },
        displayPercentage : function(percentages) {
            var fields = document.querySelectorAll('.item__percentage');
            
            var nodeListForEach = function(nodelist, callback) {
                for (i=0; i < nodelist.length; i++) {
                    callback(nodelist[i], i);
                }
            }
            nodeListForEach(fields, function(current, index){
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
        },

        displayDate : function(type) {
            var currDate, year, month, months; 
            currDate = new Date();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = currDate.getMonth();
            year = currDate.getFullYear();
            document.querySelector(".budget__title--month").textContent = months[month] + " " + year

        },
        

        clearFields : function(){
            var fields, fieldArray;
            fields = document.querySelectorAll('.add__description' + ',' + '.add__value');
            fieldArray = Array.prototype.slice.call(fields) // converting html listnode into array
            fieldArray.forEach(function(current, index, array){ 
                current.value = "";
            });
            fieldArray[0].focus()
        },
    }   
})();

var Controller = (function(budgetcntrl, UIcntrl) {
    var setUpEventListener = function(){
        document.querySelector('.add__btn').addEventListener('click', addItem);
        document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13) {
            addItem();
            }
        document.querySelector('.container').addEventListener('click', ctrlDeleteItem);
        });

    }
    // adding items to interface
    var addItem = function(){

        //getting input fields
        var input =  UIcntrl.inputItems();
        // console.log(input);

        if (input.description !== "" && !isNaN(input.value) && input.value > 0){
            // adding new items to the data
            var newItem = budgetcntrl.addItems(input.type, input.description, input.value);
            // console.log(newItem);
            // adding list of items to the interface
            UIcntrl.addListItem(newItem, input.type);

            // clearing the input fields
            UIcntrl.clearFields();
            // budgetcntrl.calculateTotal(input.type);
            updateBudget();
            updatePercentage();
            
        }
};
    // deleting items
    var ctrlDeleteItem = function(event){
        var item, splitID, type, ID;
        item = event.target.parentNode.parentNode.parentNode.parentNode.id;
        console.log(item);
        if (item){
            splitID = item.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetcntrl.deleteItems(type, ID);
            UIcntrl.deleteListItem(item);
            updateBudget();
            updatePercentage();
        }
        
    };
    // updating budget
    updateBudget = function(){
        budgetcntrl.calculateBudget();
        var budget1 = budgetcntrl.getBudget();
        UIcntrl.displayBudget(budget1);
        console.log(budget1);
    };

    //updating percentages
    updatePercentage = function(){
        // calculate percentage
        budgetcntrl.calcPercentageArray();

        // get the percentage
        var percentages = budgetcntrl.getPercentageArray();
        console.log(percentages);
        // update the percentage on UI
        UIcntrl.displayPercentage(percentages);
    }
    return {
        init : function(){
        UIcntrl.displayDate();
        setUpEventListener();
        UIcntrl.displayBudget({
            budget : 0,
            totalIncome : 0,
            totalExpenses : 0,
            percentage : '---'
            }); 
         
        }
    }
})(budgetController, UIController);
Controller.init();
window.addEventListener('click', function(event){
    console.log(event.target);
})

