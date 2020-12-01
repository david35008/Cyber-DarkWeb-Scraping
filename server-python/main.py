# pylint: disable=E0611
import os
from typing import List

from fastapi import FastAPI, HTTPException
from models import Data_Pydantic, DataIn_Pydantic, Data
from pydantic import BaseModel

from tortoise.contrib.fastapi import HTTPNotFoundError, register_tortoise

app = FastAPI(title="Tortoise ORM FastAPI example")


class Status(BaseModel):
    message: str


@app.get("/data", response_model=List[Data_Pydantic])
async def get_datas():
    return await Data_Pydantic.from_queryset(Data.all())


@app.post("/data", response_model=Data_Pydantic)
async def create_data(data: DataIn_Pydantic):
    data_obj = await Datas.create(**data.dict(exclude_unset=True))
    return await Data_Pydantic.from_tortoise_orm(data_obj)


@app.get(
    "/data/{data_id}", response_model=Data_Pydantic, responses={404: {"model": HTTPNotFoundError}}
)
async def get_data(data_id: int):
    return await Data_Pydantic.from_queryset_single(Datas.get(id=data_id))


@app.put(
    "/data/{data_id}", response_model=Data_Pydantic, responses={404: {"model": HTTPNotFoundError}}
)
async def update_data(data_id: int, data: DataIn_Pydantic):
    await Datas.filter(id=data_id).update(**data.dict(exclude_unset=True))
    return await Data_Pydantic.from_queryset_single(Datas.get(id=data_id))


@app.delete("/data/{data_id}", response_model=Status, responses={404: {"model": HTTPNotFoundError}})
async def delete_data(data_id: int):
    deleted_count = await Datas.filter(id=data_id).delete()
    if not deleted_count:
        raise HTTPException(
            status_code=404, detail=f"Data {data_id} not found")
    return Status(message=f"Deleted data {data_id}")


register_tortoise(
    app,
    # db_url=f"mysql://{os.environ['MYSQL_USER']}:{os.environ['MYSQL_PASSWORD']}@mysql:3306/{os.environ['MYSQL_DATABASE']}",
    config={
        'connections': {
            # Dict format for connection
            'default': {
                'engine': 'tortoise.backends.mysql',
                'credentials': {
                    'user': 'root',
                    'host': '127.0.0.1',
                    'port': '3306',
                    'password': 'david12345',
                    'database': 'scrapper',
                },
                'minsize': 100,
                'maxsize': 500
            },
        },
        'apps': {
            'models': {
                'models': ["models"],
                # If no default_connection specified, defaults to 'default'
                'default_connection': 'default',
            }
        }
    },
    modules={"models": ["models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
