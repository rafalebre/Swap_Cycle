"""empty message

Revision ID: 0def1c696d94
Revises: 960f08b020c3
Create Date: 2024-06-14 12:36:55.292474

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0def1c696d94'
down_revision = '960f08b020c3'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=True))
        batch_op.create_index(batch_op.f('ix_product_latitude'), ['latitude'], unique=False)
        batch_op.create_index(batch_op.f('ix_product_longitude'), ['longitude'], unique=False)

    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=True))
        batch_op.create_index(batch_op.f('ix_service_latitude'), ['latitude'], unique=False)
        batch_op.create_index(batch_op.f('ix_service_longitude'), ['longitude'], unique=False)

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('latitude', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('longitude', sa.Float(), nullable=True))
        batch_op.create_index(batch_op.f('ix_user_latitude'), ['latitude'], unique=False)
        batch_op.create_index(batch_op.f('ix_user_longitude'), ['longitude'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_user_longitude'))
        batch_op.drop_index(batch_op.f('ix_user_latitude'))
        batch_op.drop_column('longitude')
        batch_op.drop_column('latitude')

    with op.batch_alter_table('service', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_service_longitude'))
        batch_op.drop_index(batch_op.f('ix_service_latitude'))
        batch_op.drop_column('longitude')
        batch_op.drop_column('latitude')

    with op.batch_alter_table('product', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_product_longitude'))
        batch_op.drop_index(batch_op.f('ix_product_latitude'))
        batch_op.drop_column('longitude')
        batch_op.drop_column('latitude')

    # ### end Alembic commands ###