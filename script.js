const color_picker = document.getElementById("color-picker");
const color_picker_wrapper = document.getElementById("color-picker-wrapper");
const color_picker_hex_label = document.getElementById("picker-label-hex");

color_picker.onchange = function() {
	color_picker_wrapper.style.backgroundColor = color_picker.value;    
  color_picker_hex_label.innerHTML = color_picker.value;
}
color_picker_wrapper.style.backgroundColor = color_picker.value;