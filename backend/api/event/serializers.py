from functools import reduce
from rest_framework import serializers

from backend.models import Event, Account
from backend.operations.domain.create_event import create_event


def dictify(list_of_dicts, key_key=None, value_key=None):
    res = {}
    if len(list_of_dicts) > 0:
        for dict_ in list_of_dicts:
            if key_key and value_key:
                res.update({dict_[key_key]: dict_[value_key]})
            else:
                res.update({**dict_})
    return res


class ParticipationPostSerializer(serializers.Serializer):
    parts = serializers.FloatField()
    account = serializers.PrimaryKeyRelatedField(required=True,
                                                 queryset=Account.objects.all())


# TODO: write down
class InvestorPostSerializer(serializers.Serializer):
    account = serializers.PrimaryKeyRelatedField(required=True,
                                                 queryset=Account.objects.all())
    summ = serializers.FloatField(required=True)


class EventPostSerializer(serializers.ModelSerializer):
    """ Used for display event in POST, and PUT requests """
    author = serializers.PrimaryKeyRelatedField(required=True,
                                                queryset=Account.objects.all())
    participants = ParticipationPostSerializer(many=True, required=False)
    investors = InvestorPostSerializer(many=True, required=False)

    def create(self, validated_data):
        """Create event from income data. """
        raw_participants = validated_data.pop('participants', [])
        participants = dictify(raw_participants,
                               key_key='account',
                               value_key='parts')
        raw_investors = validated_data.pop('investors', [])
        investors = dictify(raw_investors,
                            key_key='account',
                            value_key='summ')

        print("EventPostSerializer::create", investors, participants)

        # TODO: move out from serializer
        event = create_event(**validated_data,
                             participants=participants,
                             investors=investors)
        return event

    def validate(self, data):
        invs = data.get('investors')
        price = data.get('price')
        if invs is not None:
            summ = reduce(lambda a, x: a + float(x['summ']), invs, 0)
            if summ != price:
                raise serializers.ValidationError("investors summ should equal "
                                                  "event price")
        return data

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private',
                  'participants', 'investors')


class ParticipationSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='account.id')
    parts = serializers.IntegerField()
    username = serializers.CharField(source='account.user.username')
    rate = serializers.IntegerField(source='account.rate')
    is_superuser = serializers.BooleanField(source='account.user.is_superuser')
    first_name = serializers.CharField(source='account.user.first_name')
    last_name = serializers.CharField(source='account.user.last_name')
    url = serializers.HyperlinkedRelatedField(source='account',
                                              read_only=True,
                                              many=False,
                                              view_name='api-account-detail')


# TODO: write down
class InvestorSerializer(serializers.Serializer):
    summ = serializers.FloatField()
    account = serializers.HyperlinkedRelatedField(read_only=True,
                                                  view_name='account-detail')


class EventFullSerializer(serializers.ModelSerializer):
    """Extended with participants list."""
    # TODO: используем related_name
    participants = ParticipationSerializer(many=True, read_only=True)
    author = serializers.StringRelatedField()
    investors = InvestorSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private',
                  'participants', 'investors')


class EventSerializer(serializers.ModelSerializer):
    """ Simple serializer for model. Difference from 'EventFullSerializer' that
    is author represented with his id, and has no participants array."""

    class Meta:
        model = Event
        fields = ('id', 'name', 'date', 'price', 'author', 'private')
