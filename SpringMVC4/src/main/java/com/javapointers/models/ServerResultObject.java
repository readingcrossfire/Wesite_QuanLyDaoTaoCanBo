package com.javapointers.models;

public class ServerResultObject {
    public boolean Successed;
    public String Content;

    public void GanSuccessed(boolean value){
        this.Successed=value;
    }

    public boolean LaySuccessed(){
        return this.Successed;
    }

    public void GanContent(String value){
        this.Content=value;
    }

    public String LayContent(){
        return this.Content;
    }

}
