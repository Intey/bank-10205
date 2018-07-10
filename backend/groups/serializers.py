from rest_framework import serializers

from backend.models import Group, GroupParticipation, Account


class GroupParticipationSerializer(serializers.ModelSerializer):
    # account = serializers.PrimaryKeyRelatedField(required=True, queryset=Account.objects.all())
    class Meta:
        model = GroupParticipation
        fields = ('id', 'parts', 'account')


class GroupSerializer(serializers.ModelSerializer):
    participants = GroupParticipationSerializer(many=True, required=False,
                                                read_only=True)
    class Meta:
        model = Group
        fields = ('id', 'name', 'participants')
