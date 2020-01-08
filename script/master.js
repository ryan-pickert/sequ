class MasterModule
{
    constructor()
    {      
        this.name = "Master Out";
        this.module = Tone.Master;
        this.inputs = [];
        this.createUI();
    }
    control(p, value)
    {
        
    }
    createUI()
    {
        var mod = document.createElement("div");
        var modIndex = Modules.length;
        var layout = "<div class='module' id='"+modIndex+"' style='width:102px'>"+
                      "<div class='name'>Master</div>"+
                      "<div class='section'>Signal Out</div>"+
                      "</div";

        mod.innerHTML = layout;
        document.getElementById("wrapper").appendChild(mod);

        this.inputs.push(document.createElement("div"));

        this.inputs[0].innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        this.inputs[0].classList.add("input");
        this.inputs[0].onclick = function(){Connect(mod, this, "signal")};
        document.getElementById(modIndex).appendChild(this.inputs[0]);
    }
}