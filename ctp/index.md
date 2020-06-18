# CahTypeTeam

<style>
.ctp {
  transform: translateY(10vh);
  text-align: center;
  margin-top: 25px;
  margin-bottom: 10px;
}

.tooltip {
  position: relative;
  display: inline-block;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 140px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -75px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

hr.garis { 
  border: 1px solid;
  text-align: center;
  height: 2px;
  margin: auto;
}
</style>
<script>
function myFunction() {
  /* Get the text field */
  var copyText = document.getElementById("myInput");

  /* Select the text field */
  copyText.select();
  copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}
</script>


 <div class="ctp">
		  <input type="text" value="ℭƬⱣ〆Cah" id="myInput">
		  <button onclick="myFunction()">Copy me!</button>
		  <hr class="garis">
		  </hr>
		  <p><a href="https://khusika.com">↑ Back Home ↑</a></p>
 </div>

