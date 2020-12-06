from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class Data(models.Model):
    """
    The Data model
    """

    id = fields.IntField(pk=True)
    #: This is a dataname
    title = fields.TextField()
    author = fields.TextField()
    content = fields.TextField()
    date = fields.DatetimeField()
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

Data_Pydantic = pydantic_model_creator(Data, name="user")
DataIn_Pydantic = pydantic_model_creator(Data, name="DataIn", exclude_readonly=True)
