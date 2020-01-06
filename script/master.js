class MasterModule
{
    constructor()
    {      
        this.name = "Master Out";
        this.module = Tone.Master;
        this.createUI();
    }
    control(p, value)
    {
        
    }
    createUI()
    {
        var mod = document.createElement("div");
        var secName = document.createElement("div");
        var sec1 = document.createElement("div");
        var in1 = document.createElement("div");

        mod.classList.add("module");
        secName.onmousedown = function(){move(event, mod)};
        if(Modules == undefined)
            mod.id = 0;
        else
            mod.id = Modules.length;
        
        mod.appendChild(secName);
        secName.innerHTML = this.name;
        secName.classList.add("name");

        mod.appendChild(sec1);
        sec1.innerHTML = "OUT";
        sec1.classList.add("section");

        mod.appendChild(in1);
        in1.innerHTML = "<div id='inner'></div><div id='label'>In</div>";
        in1.classList.add("input");
        in1.id="signal";
        in1.onclick = function(){Connect(this)};

        document.getElementById("wrapper").appendChild(mod);
    }
}