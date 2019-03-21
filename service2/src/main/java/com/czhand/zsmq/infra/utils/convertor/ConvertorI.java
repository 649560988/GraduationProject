package com.czhand.zsmq.infra.utils.convertor;

public interface ConvertorI<E, D, T> {

    default E dtoToEntity(T dto) {
        return null;
    }

    default T entityToDto(E entity) {
        return null;
    }

    default E doToEntity(D dataObject) {
        return null;
    }

    default D entityToDo(E entity) {
        return null;
    }

    default T doToDto(D dataObject)  {
        return null;
    }

    default D dtoToDo(T dto) {
        return null;
    }
}
