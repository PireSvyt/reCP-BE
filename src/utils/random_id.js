module.exports = function random_id(length = 12) {
    /*
    
    generates a random id string
    
    parameters
    * length of the string
    
    */
  
    return (temp_id = Math.random()
      .toString(2 * length)
      .substr(2, length));
};